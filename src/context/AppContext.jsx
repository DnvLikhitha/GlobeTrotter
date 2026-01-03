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
  const [loading, setLoading] = useState(true);

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
        { id: 1, name: 'Paris', country: 'France', costIndex: 4, popularity: 95, description: 'The City of Light', image: 'https://source.unsplash.com/800x600/?paris,eiffel-tower' },
        { id: 2, name: 'Tokyo', country: 'Japan', costIndex: 5, popularity: 90, description: 'Modern meets traditional', image: 'https://source.unsplash.com/800x600/?tokyo,japan' },
        { id: 3, name: 'New York', country: 'USA', costIndex: 5, popularity: 92, description: 'The city that never sleeps', image: 'https://source.unsplash.com/800x600/?new-york,manhattan' },
        { id: 4, name: 'Barcelona', country: 'Spain', costIndex: 3, popularity: 88, description: 'Gaudi\'s masterpiece city', image: 'https://source.unsplash.com/800x600/?barcelona,sagrada-familia' },
        { id: 5, name: 'Bangkok', country: 'Thailand', costIndex: 2, popularity: 85, description: 'Street food paradise', image: 'https://source.unsplash.com/800x600/?bangkok,thailand' },
        { id: 6, name: 'London', country: 'UK', costIndex: 5, popularity: 93, description: 'Historic and modern blend', image: 'https://source.unsplash.com/800x600/?london,big-ben' },
        { id: 7, name: 'Rome', country: 'Italy', costIndex: 4, popularity: 91, description: 'The Eternal City', image: 'https://source.unsplash.com/800x600/?rome,colosseum' },
        { id: 8, name: 'Dubai', country: 'UAE', costIndex: 4, popularity: 87, description: 'Luxury and innovation', image: 'https://source.unsplash.com/800x600/?dubai,burj-khalifa' },
        { id: 9, name: 'Bali', country: 'Indonesia', costIndex: 2, popularity: 89, description: 'Tropical paradise', image: 'https://source.unsplash.com/800x600/?bali,beach' },
        { id: 10, name: 'Sydney', country: 'Australia', costIndex: 4, popularity: 86, description: 'Harbor city beauty', image: 'https://source.unsplash.com/800x600/?sydney,opera-house' },
        { id: 11, name: 'Istanbul', country: 'Turkey', costIndex: 2, popularity: 84, description: 'Where East meets West', image: 'https://source.unsplash.com/800x600/?istanbul,turkey' },
        { id: 12, name: 'Amsterdam', country: 'Netherlands', costIndex: 4, popularity: 87, description: 'City of canals', image: 'https://source.unsplash.com/800x600/?amsterdam,canal' },
        { id: 13, name: 'Singapore', country: 'Singapore', costIndex: 5, popularity: 88, description: 'The Garden City', image: 'https://source.unsplash.com/800x600/?singapore,marina-bay' },
        { id: 14, name: 'Prague', country: 'Czech Republic', costIndex: 3, popularity: 86, description: 'City of a Hundred Spires', image: 'https://source.unsplash.com/800x600/?prague,castle' },
        { id: 15, name: 'Rio de Janeiro', country: 'Brazil', costIndex: 3, popularity: 85, description: 'Marvelous city', image: 'https://source.unsplash.com/800x600/?rio-de-janeiro,brazil' },
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
    
    setLoading(false);
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
    
    // Initialize with sample trips for the user if none exist
    if (trips.length === 0) {
      const sampleTrips = [
        {
          id: 1,
          userId: 1,
          name: 'European Adventure',
          startDate: '2026-03-15',
          endDate: '2026-03-25',
          description: 'Exploring the historic cities of Europe',
          coverPhoto: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800',
          stops: [
            {
              id: 1,
              cityId: 1,
              cityName: 'Paris',
              date: '2026-03-15',
              activities: [
                { id: 1, name: 'Eiffel Tower Visit', cost: 30, completed: false },
                { id: 2, name: 'Louvre Museum', cost: 20, completed: false }
              ]
            },
            {
              id: 2,
              cityId: 6,
              cityName: 'London',
              date: '2026-03-20',
              activities: [
                { id: 6, name: 'British Museum', cost: 0, completed: false }
              ]
            }
          ]
        },
        {
          id: 2,
          userId: 1,
          name: 'Asian Discovery',
          startDate: '2026-05-10',
          endDate: '2026-05-20',
          description: 'Journey through Asia\'s most vibrant cities',
          coverPhoto: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
          stops: [
            {
              id: 1,
              cityId: 2,
              cityName: 'Tokyo',
              date: '2026-05-10',
              activities: [
                { id: 4, name: 'Shibuya Crossing', cost: 0, completed: false },
                { id: 5, name: 'Sushi Making Class', cost: 80, completed: false }
              ]
            },
            {
              id: 2,
              cityId: 5,
              cityName: 'Bangkok',
              date: '2026-05-15',
              activities: [
                { id: 9, name: 'Street Food Tour', cost: 40, completed: false },
                { id: 10, name: 'Grand Palace', cost: 15, completed: false }
              ]
            }
          ]
        },
        {
          id: 3,
          userId: 1,
          name: 'NYC Weekend Getaway',
          startDate: '2026-02-20',
          endDate: '2026-02-23',
          description: 'Quick trip to the Big Apple',
          coverPhoto: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
          stops: [
            {
              id: 1,
              cityId: 3,
              cityName: 'New York',
              date: '2026-02-20',
              activities: [
                { id: 6, name: 'Statue of Liberty', cost: 25, completed: true },
                { id: 7, name: 'Broadway Show', cost: 150, completed: true }
              ]
            }
          ]
        }
      ];
      setTrips(sampleTrips);
      localStorage.setItem('trips', JSON.stringify(sampleTrips));
    }
    
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
    loading,
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
