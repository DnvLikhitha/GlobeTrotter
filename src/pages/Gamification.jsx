import { Trophy, Award, Star, Target, TrendingUp, Zap, Crown, Gift, Sparkles, Medal, Flame } from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { checkBadgeProgress, getLeaderboard } from '../services/gamification';
import { useState, useEffect } from 'react';

const Gamification = () => {
  const { user, trips, users } = useApp();
  const [activeTab, setActiveTab] = useState('badges');
  const [badgeData, setBadgeData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hoveredBadge, setHoveredBadge] = useState(null);

  useEffect(() => {
    const progress = checkBadgeProgress(user, trips);
    setBadgeData(progress);
    
    // Mock users for leaderboard
    const allUsers = users || [
      { ...user, badges: user.badges || [], points: user.points || 125 },
      { id: 2, name: 'Sarah Johnson', badges: ['first-trip', 'explorer'], points: 385 },
      { id: 3, name: 'Mike Chen', badges: ['first-trip', 'budget-master', 'early-bird'], points: 560 },
      { id: 4, name: 'Emma Davis', badges: ['first-trip', 'explorer', 'social-butterfly'], points: 445 },
      { id: 5, name: 'Alex Kumar', badges: ['first-trip', 'globetrotter'], points: 890 }
    ];
    
    const rankings = getLeaderboard(allUsers, trips);
    setLeaderboard(rankings);
  }, [user, trips, users]);

  if (!badgeData) return null;

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <style jsx="true">{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          .animate-blob {
            animation: blob 20s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes float-badge {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          .animate-float-badge {
            animation: float-badge 3s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .animate-shimmer {
            animation: shimmer 3s infinite linear;
            background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
            background-size: 1000px 100%;
          }
          @keyframes trophy-bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.1); }
          }
          .animate-trophy {
            animation: trophy-bounce 2s ease-in-out infinite;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Epic Header with Level Progress */}
          <div className="mb-8 animate-slide-down">
            <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                }}></div>
              </div>

              {/* Sparkles decoration */}
              <div className="absolute top-4 right-4 text-cyan-300 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="absolute bottom-4 left-4 text-cyan-300 animate-pulse animation-delay-2000">
                <Star className="w-6 h-6" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className="w-8 h-8 text-cyan-300 animate-trophy" />
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Your Travel Journey
                      </h1>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyan-300" />
                        <span className="font-bold text-lg">Level {badgeData.currentLevel.level}</span>
                      </div>
                      <p className="text-xl font-medium text-white/90">{badgeData.currentLevel.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-8xl animate-float-badge drop-shadow-2xl">
                      {badgeData.currentLevel.icon}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
                      <span className="text-sm font-semibold">Rank #{leaderboard.findIndex(u => u.id === user.id) + 1 || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Progress Section */}
                <div className="space-y-4 bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Flame className="w-6 h-6 text-cyan-300" />
                      <span className="text-2xl font-bold">{badgeData.points} Points</span>
                    </div>
                    {badgeData.nextLevel && (
                      <span className="text-sm text-white/80">
                        {badgeData.nextLevel.minPoints - badgeData.points} points to <span className="font-bold">{badgeData.nextLevel.name}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden shadow-inner">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${badgeData.levelProgress}%` }}
                      >
                        <div className="absolute inset-0 animate-shimmer"></div>
                      </div>
                    </div>
                    <div 
                      className="absolute -top-1 transition-all duration-1000"
                      style={{ left: `${badgeData.levelProgress}%`, transform: 'translateX(-50%)' }}
                    >
                      <Star className="w-6 h-6 text-cyan-300 filter drop-shadow-lg animate-bounce" />
                    </div>
                  </div>

                  {badgeData.nextLevel && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Next Level:</span>
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-1">
                        <span className="text-xl">{badgeData.nextLevel.icon}</span>
                        <span className="font-semibold">{badgeData.nextLevel.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-cyan-300" />
                    <p className="text-2xl font-bold">{badgeData.earnedCount}</p>
                    <p className="text-xs text-white/70">Badges</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                    <Medal className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                    <p className="text-2xl font-bold">{trips.length}</p>
                    <p className="text-xs text-white/70">Trips</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-300" />
                    <p className="text-2xl font-bold">{Math.round(badgeData.levelProgress)}%</p>
                    <p className="text-xs text-white/70">Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {[
              { key: 'badges', icon: Award, label: 'Badges', color: 'from-blue-500 to-cyan-500' },
              { key: 'leaderboard', icon: Trophy, label: 'Leaderboard', color: 'from-cyan-500 to-teal-500' },
              { key: 'challenges', icon: Target, label: 'Challenges', color: 'from-teal-500 to-blue-500' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap transform hover:scale-105 ${
                  activeTab === tab.key
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105`
                    : 'bg-white text-gray-600 hover:shadow-lg border-2 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-6 h-6 transition-transform group-hover:rotate-12 ${
                    activeTab === tab.key ? 'animate-bounce' : ''
                  }`} />
                  <span className="text-lg">{tab.label}</span>
                </div>
                {activeTab === tab.key && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Badges Tab - Enhanced */}
          {activeTab === 'badges' && (
            <div className="animate-slide-down">
              <div className="mb-8 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Achievement Badges</h2>
                    <p className="text-gray-600">Unlock badges by completing travel milestones</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    {badgeData.earnedCount}/{badgeData.totalBadges}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">Collected</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {badgeData.badges.map((badge, index) => (
                  <div
                    key={badge.id}
                    onMouseEnter={() => setHoveredBadge(badge.id)}
                    onMouseLeave={() => setHoveredBadge(null)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className={`relative rounded-2xl p-6 border-3 transition-all duration-500 cursor-pointer animate-slide-down ${
                      badge.isEarned
                        ? 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-blue-400 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-rotate-2'
                        : 'bg-white border-gray-300 opacity-60 hover:opacity-90 hover:scale-105 grayscale hover:grayscale-0'
                    }`}
                  >
                    {/* Earned Badge Checkmark with glow */}
                    {badge.isEarned && (
                      <>
                        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                        </div>
                      </>
                    )}
                    
                    {/* Badge Icon with animation */}
                    <div className={`text-7xl mb-4 transform transition-transform ${
                      hoveredBadge === badge.id ? 'scale-125 rotate-12' : 'scale-100'
                    } ${badge.isEarned ? 'animate-float-badge' : ''}`}>
                      {badge.icon}
                    </div>
                    
                    {/* Badge Info */}
                    <h3 className="font-black text-xl text-gray-900 mb-2">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{badge.description}</p>
                    
                    {/* Points Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full px-4 py-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-black text-blue-700">{badge.points} pts</span>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{badge.current} / {badge.required}</span>
                    </div>
                    
                    {/* Progress Bar with gradient */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 relative overflow-hidden ${
                            badge.isEarned 
                              ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400' 
                              : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                          }`}
                          style={{ width: `${badge.progress}%` }}
                        >
                          {badge.isEarned && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-600 mt-1 block text-right">
                        {badge.progress}%
                      </span>
                    </div>

                    {/* Hover Effect - Show more details */}
                    {hoveredBadge === badge.id && !badge.isEarned && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl flex items-end p-4 animate-slide-down">
                        <p className="text-white text-sm font-semibold">
                          Keep going! {badge.required - badge.current} more to unlock 🎯
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab - Enhanced */}
          {activeTab === 'leaderboard' && (
            <div className="animate-slide-down">
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg animate-trophy">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Global Leaderboard</h2>
                    <p className="text-gray-600">Compete with travelers worldwide</p>
                  </div>
                </div>
              </div>

              {/* Top 3 Podium */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                {leaderboard.slice(0, 3).map((rankedUser, index) => (
                  <div
                    key={rankedUser.id}
                    className={`relative ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`bg-gradient-to-br ${
                      index === 0 ? 'from-cyan-400 to-blue-500 pt-0' : 
                      index === 1 ? 'from-gray-300 to-gray-400 pt-8' : 
                      'from-teal-500 to-cyan-600 pt-12'
                    } rounded-t-3xl p-6 text-center transform hover:scale-105 transition-all shadow-2xl animate-slide-down`}>
                      {/* Trophy/Medal Icon */}
                      <div className="text-6xl mb-3 animate-bounce">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                      </div>
                      
                      {/* Avatar */}
                      <div className={`w-20 h-20 mx-auto mb-3 rounded-full bg-white flex items-center justify-center text-3xl font-black shadow-lg ${
                        index === 0 ? 'ring-4 ring-cyan-300' : ''
                      }`}>
                        {rankedUser.name.charAt(0)}
                      </div>
                      
                      {/* Name */}
                      <h3 className="font-black text-white text-lg mb-1 truncate">{rankedUser.name}</h3>
                      
                      {/* Points */}
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mt-3">
                        <p className="text-2xl font-black text-white">{rankedUser.points}</p>
                        <p className="text-xs text-white/80">points</p>
                      </div>
                      
                      {/* Rank Number */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-white">
                        <span className="text-2xl font-black text-gray-900">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Rest of Leaderboard */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      <tr>
                        <th className="px-6 py-5 text-left font-black text-lg">Rank</th>
                        <th className="px-6 py-5 text-left font-black text-lg">Traveler</th>
                        <th className="px-6 py-5 text-left font-black text-lg">Level</th>
                        <th className="px-6 py-5 text-right font-black text-lg">Points</th>
                        <th className="px-6 py-5 text-right font-black text-lg">Badges</th>
                        <th className="px-6 py-5 text-right font-black text-lg">Trips</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leaderboard.slice(3, 20).map((rankedUser, index) => (
                        <tr
                          key={rankedUser.id}
                          className={`transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 ${
                            rankedUser.id === user.id ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500' : ''
                          }`}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="font-black text-gray-700">#{rankedUser.rank}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                {rankedUser.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{rankedUser.name}</p>
                                {rankedUser.id === user.id && (
                                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-black px-3 py-1 rounded-full">
                                    <Crown className="w-3 h-3" />
                                    YOU
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full px-4 py-2 w-fit">
                              <span className="text-2xl">{rankedUser.levelIcon}</span>
                              <span className="font-bold text-gray-900">Lvl {rankedUser.level}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full px-4 py-2">
                              <Zap className="w-4 h-4 text-blue-600" />
                              <span className="font-black text-blue-700 text-lg">{rankedUser.points}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2">
                              <Award className="w-4 h-4 text-blue-600" />
                              <span className="font-bold text-blue-700">{rankedUser.badges}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="font-bold text-gray-900 text-lg">{rankedUser.stats.totalTrips || 0}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Challenges Tab - Enhanced */}
          {activeTab === 'challenges' && (
            <div className="animate-slide-down">
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Active Challenges</h2>
                    <p className="text-gray-600">Complete challenges to earn bonus points</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Challenge 1 */}
                <div className="group relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 border-3 border-blue-300 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.1) 10px, rgba(59, 130, 246, 0.1) 20px)'
                    }}></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-6xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                        🇪🇺
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          200 pts
                        </span>
                        <span className="bg-cyan-400 text-cyan-900 text-xs font-black px-3 py-1 rounded-full animate-pulse">
                          🔥 HOT
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-black text-2xl text-gray-900 mb-3">European Explorer</h3>
                    <p className="text-gray-700 mb-6 font-medium">Visit 5 European countries in 2026</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-700">Progress</span>
                        <span className="text-blue-700 text-lg">2 / 5 countries</span>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="relative">
                        <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner border-2 border-blue-200">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full relative overflow-hidden transition-all duration-1000"
                            style={{ width: '40%' }}
                          >
                            <div className="absolute inset-0 animate-shimmer"></div>
                          </div>
                        </div>
                        <div className="absolute -right-2 -top-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-lg">
                          40%
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t-2 border-blue-200">
                        <span className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Ends Dec 31, 2026
                        </span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-all transform hover:scale-110">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge 2 */}
                <div className="group relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-3 border-green-300 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(34, 197, 94, 0.1) 10px, rgba(34, 197, 94, 0.1) 20px)'
                    }}></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-6xl transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">
                        💵
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          150 pts
                        </span>
                        <span className="bg-teal-400 text-teal-900 text-xs font-black px-3 py-1 rounded-full">
                          ⭐ POPULAR
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-black text-2xl text-gray-900 mb-3">Budget Champion</h3>
                    <p className="text-gray-700 mb-6 font-medium">Complete 3 trips under $500 each</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-700">Progress</span>
                        <span className="text-green-700 text-lg">1 / 3 trips</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner border-2 border-green-200">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full relative overflow-hidden transition-all duration-1000"
                            style={{ width: '33%' }}
                          >
                            <div className="absolute inset-0 animate-shimmer"></div>
                          </div>
                        </div>
                        <div className="absolute -right-2 -top-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-lg">
                          33%
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t-2 border-green-200">
                        <span className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Ends Dec 31, 2026
                        </span>
                        <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-all transform hover:scale-110">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge 3 */}
                <div className="group relative bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 border-3 border-teal-300 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)'
                    }}></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-6xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                        🏛️
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          100 pts
                        </span>
                        <span className="bg-blue-400 text-blue-900 text-xs font-black px-3 py-1 rounded-full">
                          ✨ NEW
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-black text-2xl text-gray-900 mb-3">Culture Seeker</h3>
                    <p className="text-gray-700 mb-6 font-medium">Visit 15 museums this year</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-700">Progress</span>
                        <span className="text-teal-700 text-lg">4 / 15 museums</span>
                      </div>
                      
                      <div className="relative">
                        <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner border-2 border-teal-200">
                          <div 
                            className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-full relative overflow-hidden transition-all duration-1000"
                            style={{ width: '27%' }}
                          >
                            <div className="absolute inset-0 animate-shimmer"></div>
                          </div>
                        </div>
                        <div className="absolute -right-2 -top-2 bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black shadow-lg">
                          27%
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t-2 border-teal-200">
                        <span className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Ends Dec 31, 2026
                        </span>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-all transform hover:scale-110">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Gamification;
