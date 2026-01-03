// Loading skeleton components for better UX

export const TripCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Upcoming Trips */}
    <div className="card p-6">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="animate-pulse">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          {[...Array(cols)].map((_, i) => (
            <th key={i} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b border-gray-100">
            {[...Array(cols)].map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ActivityCardSkeleton = () => (
  <div className="card p-4 animate-pulse">
    <div className="flex gap-4">
      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="card p-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card p-6">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  </div>
);

export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading your adventure...</p>
    </div>
  </div>
);
