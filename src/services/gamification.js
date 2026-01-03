// Gamification system for user engagement

export const BADGES = [
  {
    id: 'first-trip',
    name: 'First Steps',
    description: 'Created your first trip',
    icon: '🎯',
    points: 10,
    requirement: { type: 'trips', count: 1 }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visited 5 different cities',
    icon: '🗺️',
    points: 50,
    requirement: { type: 'cities', count: 5 }
  },
  {
    id: 'globetrotter',
    name: 'Globe Trotter',
    description: 'Visited 10 different countries',
    icon: '🌍',
    points: 100,
    requirement: { type: 'countries', count: 10 }
  },
  {
    id: 'budget-master',
    name: 'Budget Master',
    description: 'Stayed under budget on 5 trips',
    icon: '💰',
    points: 75,
    requirement: { type: 'budget_success', count: 5 }
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Booked 3 trips more than 60 days in advance',
    icon: '🐦',
    points: 40,
    requirement: { type: 'early_booking', count: 3 }
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Shared 10 trips with the community',
    icon: '🦋',
    points: 60,
    requirement: { type: 'shared_trips', count: 10 }
  },
  {
    id: 'culture-vulture',
    name: 'Culture Vulture',
    description: 'Visited 20 museums and cultural sites',
    icon: '🎭',
    points: 80,
    requirement: { type: 'cultural_activities', count: 20 }
  },
  {
    id: 'foodie',
    name: 'Foodie Explorer',
    description: 'Tried 30 different cuisines',
    icon: '🍜',
    points: 70,
    requirement: { type: 'culinary_activities', count: 30 }
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Chose eco-friendly transportation 5 times',
    icon: '🌱',
    points: 90,
    requirement: { type: 'eco_friendly', count: 5 }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Experienced 10 nightlife activities',
    icon: '🦉',
    points: 45,
    requirement: { type: 'nightlife', count: 10 }
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Added photos to 15 trips',
    icon: '📸',
    points: 55,
    requirement: { type: 'photos', count: 15 }
  },
  {
    id: 'adventurer',
    name: 'Adventurer',
    description: 'Completed 10 adventure activities',
    icon: '🏔️',
    points: 85,
    requirement: { type: 'adventure', count: 10 }
  }
];

export const LEVELS = [
  { level: 1, name: 'Novice Traveler', minPoints: 0, maxPoints: 99, icon: '🌟' },
  { level: 2, name: 'Weekend Explorer', minPoints: 100, maxPoints: 249, icon: '⭐' },
  { level: 3, name: 'City Hopper', minPoints: 250, maxPoints: 499, icon: '✨' },
  { level: 4, name: 'Country Navigator', minPoints: 500, maxPoints: 999, icon: '🌠' },
  { level: 5, name: 'Continental Voyager', minPoints: 1000, maxPoints: 1999, icon: '💫' },
  { level: 6, name: 'Globe Trotter', minPoints: 2000, maxPoints: 3999, icon: '🌟' },
  { level: 7, name: 'World Explorer', minPoints: 4000, maxPoints: 7999, icon: '🏆' },
  { level: 8, name: 'Travel Legend', minPoints: 8000, maxPoints: 15999, icon: '👑' },
  { level: 9, name: 'Ultimate Wanderer', minPoints: 16000, maxPoints: 999999, icon: '🌌' }
];

export const calculateUserStats = (user, trips) => {
  const completedTrips = trips.filter(t => new Date(t.endDate) < new Date());
  const cities = new Set(trips.flatMap(t => t.stops?.map(s => s.city) || []));
  const countries = new Set(trips.flatMap(t => t.stops?.map(s => s.country) || []));
  
  const totalActivities = trips.reduce((sum, trip) => {
    return sum + (trip.stops?.reduce((s, stop) => s + (stop.activities?.length || 0), 0) || 0);
  }, 0);
  
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
  
  return {
    totalTrips: trips.length,
    completedTrips: completedTrips.length,
    citiesVisited: cities.size,
    countriesVisited: countries.size,
    totalActivities,
    totalBudget,
    averageTripDuration: trips.length > 0 
      ? Math.round(trips.reduce((sum, t) => {
          return sum + Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / (1000 * 60 * 60 * 24));
        }, 0) / trips.length)
      : 0
  };
};

export const checkBadgeProgress = (user, trips) => {
  const stats = calculateUserStats(user, trips);
  const earnedBadges = user.badges || [];
  const totalPoints = user.points || 0;
  
  const badgeProgress = BADGES.map(badge => {
    const isEarned = earnedBadges.includes(badge.id);
    let progress = 0;
    let current = 0;
    
    switch (badge.requirement.type) {
      case 'trips':
        current = stats.totalTrips;
        break;
      case 'cities':
        current = stats.citiesVisited;
        break;
      case 'countries':
        current = stats.countriesVisited;
        break;
      case 'cultural_activities':
        current = Math.floor(stats.totalActivities * 0.3); // Mock percentage
        break;
      case 'culinary_activities':
        current = Math.floor(stats.totalActivities * 0.25);
        break;
      default:
        current = 0;
    }
    
    progress = Math.min((current / badge.requirement.count) * 100, 100);
    
    return {
      ...badge,
      isEarned,
      progress: Math.round(progress),
      current,
      required: badge.requirement.count
    };
  });
  
  const currentLevel = LEVELS.reduce((prev, curr) => 
    totalPoints >= curr.minPoints ? curr : prev
  , LEVELS[0]);
  
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const levelProgress = nextLevel 
    ? Math.round(((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100)
    : 100;
  
  return {
    badges: badgeProgress,
    earnedCount: badgeProgress.filter(b => b.isEarned).length,
    totalBadges: BADGES.length,
    points: totalPoints,
    currentLevel,
    nextLevel,
    levelProgress
  };
};

export const awardBadge = (user, badgeId) => {
  const badge = BADGES.find(b => b.id === badgeId);
  if (!badge || user.badges?.includes(badgeId)) {
    return user;
  }
  
  return {
    ...user,
    badges: [...(user.badges || []), badgeId],
    points: (user.points || 0) + badge.points
  };
};

export const getLeaderboard = (users, trips) => {
  // Calculate points for all users
  return users
    .map(user => {
      const userTrips = trips.filter(t => t.userId === user.id);
      const stats = calculateUserStats(user, userTrips);
      const points = user.points || 0;
      const level = LEVELS.reduce((prev, curr) => 
        points >= curr.minPoints ? curr : prev
      , LEVELS[0]);
      
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        points,
        level: level.level,
        levelName: level.name,
        levelIcon: level.icon,
        badges: user.badges?.length || 0,
        stats
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({ ...user, rank: index + 1 }));
};

export const CHALLENGES = [
  {
    id: 'europe-explorer',
    name: 'European Explorer',
    description: 'Visit 5 European countries in 2026',
    reward: 200,
    icon: '🇪🇺',
    deadline: '2026-12-31',
    requirement: { type: 'countries', region: 'Europe', count: 5 }
  },
  {
    id: 'budget-champion',
    name: 'Budget Champion',
    description: 'Complete 3 trips under $500 each',
    reward: 150,
    icon: '💵',
    deadline: '2026-12-31',
    requirement: { type: 'budget_trips', maxBudget: 500, count: 3 }
  },
  {
    id: 'culture-seeker',
    name: 'Culture Seeker',
    description: 'Visit 15 museums this year',
    reward: 100,
    icon: '🏛️',
    deadline: '2026-12-31',
    requirement: { type: 'activity_type', category: 'culture', count: 15 }
  }
];
