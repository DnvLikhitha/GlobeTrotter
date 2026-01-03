// Real-time API integrations for weather, currency, and flight data

// Weather API Service
export const getWeatherForecast = async (city, startDate, endDate) => {
  // In production, integrate with OpenWeather API
  // For demo, return intelligent mock data
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
  const icons = ['☀️', '⛅', '☁️', '🌧️', '🌤️'];
  
  const forecast = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const temp = Math.floor(Math.random() * 15) + 15; // 15-30°C
    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    forecast.push({
      date: new Date(d).toISOString().split('T')[0],
      temperature: { min: temp, max: temp + 8 },
      condition: condition,
      icon: icons[weatherConditions.indexOf(condition)],
      humidity: Math.floor(Math.random() * 30) + 50,
      windSpeed: Math.floor(Math.random() * 15) + 5
    });
  }
  
  return {
    city,
    forecast,
    summary: `Expect ${forecast[0].condition.toLowerCase()} conditions with temperatures around ${forecast[0].temperature.max}°C`
  };
};

// Currency Conversion Service
export const convertCurrency = async (amount, from, to) => {
  // In production, integrate with Fixer.io or ExchangeRate-API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const exchangeRates = {
    'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 148.5, 'INR': 83.2 },
    'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 161.5, 'INR': 90.5 },
    'GBP': { 'USD': 1.27, 'EUR': 1.16, 'JPY': 188.2, 'INR': 105.3 },
    'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.78 }
  };
  
  const rate = exchangeRates[from]?.[to] || 1;
  const converted = amount * rate;
  
  return {
    original: { amount, currency: from },
    converted: { amount: Math.round(converted * 100) / 100, currency: to },
    rate,
    timestamp: new Date().toISOString()
  };
};

// Flight Search Service
export const searchFlights = async (from, to, date, passengers = 1) => {
  // In production, integrate with Skyscanner or Amadeus API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const airlines = ['Air France', 'Lufthansa', 'Emirates', 'Qatar Airways', 'British Airways'];
  const basePrice = Math.floor(Math.random() * 500) + 200;
  
  const flights = [];
  for (let i = 0; i < 5; i++) {
    const departure = new Date(date);
    departure.setHours(6 + i * 3);
    const arrival = new Date(departure);
    arrival.setHours(arrival.getHours() + Math.floor(Math.random() * 4) + 2);
    
    flights.push({
      id: `FL${Date.now()}${i}`,
      airline: airlines[i % airlines.length],
      flightNumber: `${airlines[i].substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
      departure: {
        airport: from,
        time: departure.toISOString(),
        terminal: Math.floor(Math.random() * 3) + 1
      },
      arrival: {
        airport: to,
        time: arrival.toISOString(),
        terminal: Math.floor(Math.random() * 3) + 1
      },
      duration: `${Math.floor((arrival - departure) / (1000 * 60 * 60))}h ${Math.floor(((arrival - departure) % (1000 * 60 * 60)) / (1000 * 60))}m`,
      price: Math.floor(basePrice + i * 50),
      currency: 'USD',
      stops: Math.random() > 0.7 ? 1 : 0,
      class: 'Economy',
      seatsAvailable: Math.floor(Math.random() * 50) + 10
    });
  }
  
  return flights.sort((a, b) => a.price - b.price);
};

// Hotel Search Service
export const searchHotels = async (city, checkIn, checkOut, guests = 2) => {
  // In production, integrate with Booking.com or Expedia API
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const hotelTypes = ['Hotel', 'Boutique Hotel', 'Resort', 'Hostel', 'Apartment'];
  const amenities = [
    ['WiFi', 'Breakfast', 'Pool'],
    ['WiFi', 'Gym', 'Restaurant'],
    ['WiFi', 'Spa', 'Beach Access'],
    ['WiFi', 'Kitchen', 'Laundry'],
    ['WiFi', 'Parking', 'Pet Friendly']
  ];
  
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  
  const hotels = [];
  for (let i = 0; i < 8; i++) {
    const pricePerNight = Math.floor(Math.random() * 150) + 50;
    const rating = (Math.random() * 2 + 3).toFixed(1);
    
    hotels.push({
      id: `HT${Date.now()}${i}`,
      name: `${city} ${hotelTypes[i % hotelTypes.length]} ${i + 1}`,
      type: hotelTypes[i % hotelTypes.length],
      rating: parseFloat(rating),
      reviews: Math.floor(Math.random() * 1000) + 100,
      pricePerNight,
      totalPrice: pricePerNight * nights,
      currency: 'USD',
      amenities: amenities[i % amenities.length],
      image: `https://source.unsplash.com/400x300/?hotel,${city}`,
      location: `${Math.random() > 0.5 ? 'City Center' : 'Downtown'}, ${city}`,
      distance: (Math.random() * 5).toFixed(1) + ' km from center',
      cancellation: Math.random() > 0.5 ? 'Free cancellation' : 'Non-refundable'
    });
  }
  
  return hotels.sort((a, b) => b.rating - a.rating);
};

// Google Maps Integration Helper
export const getMapData = (stops) => {
  // Generate map markers and routes
  return stops.map((stop, index) => ({
    position: { lat: 48.8566 + index, lng: 2.3522 + index }, // Mock coordinates
    label: stop.city,
    info: `Stop ${index + 1}: ${stop.city}`
  }));
};

// Live Transportation Updates
export const getTransportationOptions = async (from, to, date) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      type: 'flight',
      duration: '2h 30m',
      price: 150,
      co2: 255,
      icon: '✈️'
    },
    {
      type: 'train',
      duration: '6h 15m',
      price: 80,
      co2: 41,
      icon: '🚄'
    },
    {
      type: 'bus',
      duration: '8h 45m',
      price: 35,
      co2: 89,
      icon: '🚌'
    },
    {
      type: 'car',
      duration: '7h 30m',
      price: 60,
      co2: 171,
      icon: '🚗'
    }
  ];
};
