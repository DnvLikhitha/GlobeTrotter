import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTrips = localStorage.getItem('trips');
    const storedCities = localStorage.getItem('cities');
    const storedActivities = localStorage.getItem('activities');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedTrips) {
      setTrips(JSON.parse(storedTrips));
    }
    if (storedCities) {
      setCities(JSON.parse(storedCities));
    } else {
      // Initialize with sample cities
      const sampleCities = [
        { id: 1, name: 'Paris', country: 'France', costIndex: 4, popularity: 95, description: 'The City of Light', image: 'https://picsum.photos/seed/paris/800/600' },
        { id: 2, name: 'Tokyo', country: 'Japan', costIndex: 5, popularity: 90, description: 'Modern meets traditional', image: 'https://picsum.photos/seed/tokyo/800/600' },
        { id: 3, name: 'New York', country: 'USA', costIndex: 5, popularity: 92, description: 'The city that never sleeps', image: 'https://picsum.photos/seed/newyork/800/600' },
        { id: 4, name: 'Barcelona', country: 'Spain', costIndex: 3, popularity: 88, description: 'Gaudi\'s masterpiece city', image: 'https://picsum.photos/seed/barcelona/800/600' },
        { id: 5, name: 'Bangkok', country: 'Thailand', costIndex: 2, popularity: 85, description: 'Street food paradise', image: 'https://picsum.photos/seed/bangkok/800/600' },
        { id: 6, name: 'London', country: 'UK', costIndex: 5, popularity: 93, description: 'Historic and modern blend', image: 'https://picsum.photos/seed/london/800/600' },
        { id: 7, name: 'Rome', country: 'Italy', costIndex: 4, popularity: 91, description: 'The Eternal City', image: 'https://picsum.photos/seed/rome/800/600' },
        { id: 8, name: 'Dubai', country: 'UAE', costIndex: 4, popularity: 87, description: 'Luxury and innovation', image: 'https://picsum.photos/seed/dubai/800/600' },
        { id: 9, name: 'Bali', country: 'Indonesia', costIndex: 2, popularity: 89, description: 'Tropical paradise', image: 'https://picsum.photos/seed/bali/800/600' },
        { id: 10, name: 'Sydney', country: 'Australia', costIndex: 4, popularity: 86, description: 'Harbor city beauty', image: 'https://picsum.photos/seed/sydney/800/600' },
      ];
      setCities(sampleCities);
      localStorage.setItem('cities', JSON.stringify(sampleCities));
    }
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      // Initialize with sample activities
      const sampleActivities = [
        { id: 1, cityId: 1, name: 'Eiffel Tower Visit', type: 'Sightseeing', cost: 30, duration: 2, description: 'Visit the iconic Eiffel Tower' },
        { id: 2, cityId: 1, name: 'Louvre Museum', type: 'Culture', cost: 20, duration: 4, description: 'Explore world-class art' },
        { id: 3, cityId: 1, name: 'Seine River Cruise', type: 'Adventure', cost: 25, duration: 1.5, description: 'Romantic boat ride' },
        { id: 4, cityId: 2, name: 'Shibuya Crossing', type: 'Sightseeing', cost: 0, duration: 0.5, description: 'Famous pedestrian crossing' },
        { id: 5, cityId: 2, name: 'Sushi Making Class', type: 'Food', cost: 80, duration: 3, description: 'Learn authentic sushi' },
        { id: 6, cityId: 3, name: 'Statue of Liberty', type: 'Sightseeing', cost: 25, duration: 3, description: 'American icon visit' },
        { id: 7, cityId: 3, name: 'Broadway Show', type: 'Entertainment', cost: 150, duration: 2.5, description: 'World-class theater' },
        { id: 8, cityId: 4, name: 'Sagrada Familia', type: 'Sightseeing', cost: 35, duration: 2, description: 'Gaudi\'s masterpiece' },
        { id: 9, cityId: 5, name: 'Street Food Tour', type: 'Food', cost: 40, duration: 3, description: 'Taste authentic Thai cuisine' },
        { id: 10, cityId: 5, name: 'Grand Palace', type: 'Culture', cost: 15, duration: 2, description: 'Royal Thai architecture' },
      ];
      setActivities(sampleActivities);
      localStorage.setItem('activities', JSON.stringify(sampleActivities));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  const login = (email, password) => {
    // Simple mock authentication
    const mockUser = {
      id: 1,
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=2563eb&color=fff`,
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };

  const signup = (name, email, password) => {
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=2563eb&color=fff`,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: Date.now(),
      userId: user?.id,
      stops: [],
      createdAt: new Date().toISOString(),
    };
    setTrips([...trips, newTrip]);
    return newTrip;
  };

  const updateTrip = (tripId, updates) => {
    setTrips(trips.map(trip => trip.id === tripId ? { ...trip, ...updates } : trip));
  };

  const deleteTrip = (tripId) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
  };

  const addStopToTrip = (tripId, stop) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      const newStop = {
        ...stop,
        id: Date.now(),
        activities: [],
      };
      updateTrip(tripId, {
        stops: [...(trip.stops || []), newStop],
      });
      return newStop;
    }
  };

  const updateStop = (tripId, stopId, updates) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      const updatedStops = trip.stops.map(stop =>
        stop.id === stopId ? { ...stop, ...updates } : stop
      );
      updateTrip(tripId, { stops: updatedStops });
    }
  };

  const deleteStop = (tripId, stopId) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      updateTrip(tripId, {
        stops: trip.stops.filter(stop => stop.id !== stopId),
      });
    }
  };

  const addActivityToStop = (tripId, stopId, activity) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      const updatedStops = trip.stops.map(stop => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: [...(stop.activities || []), { ...activity, id: Date.now() }],
          };
        }
        return stop;
      });
      updateTrip(tripId, { stops: updatedStops });
    }
  };

  const removeActivityFromStop = (tripId, stopId, activityId) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      const updatedStops = trip.stops.map(stop => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: stop.activities.filter(a => a.id !== activityId),
          };
        }
        return stop;
      });
      updateTrip(tripId, { stops: updatedStops });
    }
  };

  const getTripById = (tripId) => {
    return trips.find(trip => trip.id === parseInt(tripId));
  };

  const getUserTrips = () => {
    return trips.filter(trip => trip.userId === user?.id);
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    login,
    signup,
    logout,
    trips,
    cities,
    activities,
    addTrip,
    updateTrip,
    deleteTrip,
    getTripById,
    getUserTrips,
    addStopToTrip,
    updateStop,
    deleteStop,
    addActivityToStop,
    removeActivityFromStop,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
