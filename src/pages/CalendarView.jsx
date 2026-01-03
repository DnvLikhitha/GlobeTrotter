import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

const CalendarView = () => {
  const { getUserTrips, cities } = useApp();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024 as in mockup
  
  const trips = getUserTrips();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTripsForDate = (date) => {
    return trips.filter(trip => {
      const tripStart = parseISO(trip.startDate);
      const tripEnd = parseISO(trip.endDate);
      return date >= tripStart && date <= tripEnd;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Get the day of week for the first day of the month
  const firstDayOfWeek = monthStart.getDay();

  // Create array with empty cells for days before month starts
  const calendarDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Calendar View
          </h1>
          <p className="text-gray-600 text-lg">
            View all your trips in a calendar layout
          </p>
        </div>

        {/* Calendar Card */}
        <div className="card p-8">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search bar ......"
              className="input-field flex-1"
            />
            <button className="btn-secondary px-4 py-2">Group by</button>
            <button className="btn-secondary px-4 py-2">Filter</button>
            <button className="btn-secondary px-4 py-2">Sort by...</button>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg">
            {/* Week Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="h-24 bg-gray-50"></div>;
                }

                const tripsOnDay = getTripsForDate(day);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-24 border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !isSameMonth(day, currentDate) ? 'bg-gray-50' : 'bg-white'
                    } ${isToday ? 'ring-2 ring-teal-600' : ''}`}
                    onClick={() => {
                      if (tripsOnDay.length > 0) {
                        navigate(`/trips/${tripsOnDay[0].id}`);
                      }
                    }}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`text-sm font-medium mb-1 ${
                        !isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      
                      {tripsOnDay.length > 0 && (
                        <div className="flex-1 overflow-hidden">
                          {tripsOnDay.slice(0, 2).map((trip) => (
                            <div
                              key={trip.id}
                              className="text-xs bg-teal-100 text-teal-800 rounded px-1 py-0.5 mb-1 truncate font-medium"
                            >
                              {trip.name}
                            </div>
                          ))}
                          {tripsOnDay.length > 2 && (
                            <div className="text-xs text-gray-500 font-medium">
                              +{tripsOnDay.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-100 rounded"></div>
              <span className="text-gray-600">Trip Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-teal-600 rounded"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>
        </div>

        {/* Upcoming Trips List */}
        {trips.length > 0 && (
          <div className="card p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Trips</h3>
            <div className="space-y-3">
              {trips.slice(0, 5).map((trip) => {
                const city = trip.stops?.[0] ? cities.find(c => c.id === trip.stops[0].cityId) : null;
                return (
                  <div
                    key={trip.id}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">{trip.name}</h4>
                      <p className="text-sm text-gray-600">
                        {format(parseISO(trip.startDate), 'MMM d')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{city?.name || 'Multiple Cities'}</p>
                      <p className="text-xs text-gray-400">{trip.stops?.length || 0} stops</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CalendarView;
