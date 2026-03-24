import React, { useMemo } from 'react';
import { TrendingUp, Activity, Moon, Zap, Heart, AlertCircle, Sparkles } from 'lucide-react';

const MOOD_VALUES = {
  'Great': 5,
  'Good': 4,
  'Okay': 3,
  'Struggling': 2,
  'Crisis': 1,
};

const MOOD_COLORS = {
  'Great': '#10b981',
  'Good': '#3b82f6',
  'Okay': '#f59e0b',
  'Struggling': '#f97316',
  'Crisis': '#ef4444',
};

function MiniLineChart({ data, height = 60, color = '#10b981' }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 100;
  const padding = 4;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((val, i) => {
        const x = (i / (data.length - 1 || 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
      })}
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, sublabel, trend, color = '#10b981' }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center`} style={{ backgroundColor: color + '22' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-white text-2xl font-bold">{value}</p>
      <p className="text-gray-400 text-xs mt-1">{label}</p>
      {sublabel && <p className="text-gray-500 text-xs mt-0.5">{sublabel}</p>}
    </div>
  );
}

export default function Analytics({ userData, onNavigate }) {
  const moodLog = userData.moodLog || [];

  const analytics = useMemo(() => {
    if (moodLog.length === 0) {
      return {
        avgMood: 0,
        avgEnergy: 0,
        avgSleep: 0,
        moodTrend: [],
        energyTrend: [],
        sleepTrend: [],
        topTriggers: [],
        totalEntries: 0,
        streakDays: 0,
        moodDistribution: {},
      };
    }

    const last30Days = moodLog.slice(-30);
    const last7Days = moodLog.slice(-7);

    // Calculate averages
    const avgMood = last30Days.reduce((sum, e) => sum + (MOOD_VALUES[e.mood] || 3), 0) / last30Days.length;
    const avgEnergy = last30Days.reduce((sum, e) => sum + (e.energy || 0), 0) / last30Days.length;
    const avgSleep = last30Days.reduce((sum, e) => sum + (e.sleep || 0), 0) / last30Days.length;

    // Previous period for trends
    const prev30Days = moodLog.slice(-60, -30);
    const prevAvgMood = prev30Days.length > 0
      ? prev30Days.reduce((sum, e) => sum + (MOOD_VALUES[e.mood] || 3), 0) / prev30Days.length
      : avgMood;

    const moodTrend = ((avgMood - prevAvgMood) / (prevAvgMood || 1)) * 100;

    // Trends for charts (last 14 days)
    const last14 = moodLog.slice(-14);
    const moodTrendData = last14.map(e => MOOD_VALUES[e.mood] || 3);
    const energyTrendData = last14.map(e => e.energy || 0);
    const sleepTrendData = last14.map(e => e.sleep || 0);

    // Top triggers
    const triggerCount = {};
    last30Days.forEach(e => {
      (e.triggers || []).forEach(t => {
        triggerCount[t] = (triggerCount[t] || 0) + 1;
      });
    });
    const topTriggers = Object.entries(triggerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));

    // Mood distribution
    const moodDistribution = {};
    last30Days.forEach(e => {
      const mood = e.mood || 'Okay';
      moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
    });

    // Calculate current streak
    let streakDays = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasEntry = moodLog.some(e => {
        const entryDate = new Date(e.date);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      if (hasEntry) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      avgMood,
      avgEnergy,
      avgSleep,
      moodTrend,
      moodTrendData,
      energyTrendData,
      sleepTrendData,
      topTriggers,
      totalEntries: moodLog.length,
      streakDays,
      moodDistribution,
      last7Days,
    };
  }, [moodLog]);

  const getMoodLabel = (value) => {
    if (value >= 4.5) return 'Excellent';
    if (value >= 3.5) return 'Good';
    if (value >= 2.5) return 'Fair';
    if (value >= 1.5) return 'Difficult';
    return 'Very Difficult';
  };

  if (moodLog.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No Data Yet</h3>
          <p className="text-gray-400 text-sm mb-4">
            Start tracking your mood and wellness to see analytics and trends.
          </p>
          <button
            onClick={() => onNavigate('tracker')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm"
          >
            Go to Tracker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Insights from your recovery journey</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Activity}
          label="Average Mood"
          value={getMoodLabel(analytics.avgMood)}
          sublabel="Last 30 days"
          trend={Math.round(analytics.moodTrend)}
          color="#10b981"
        />
        <StatCard
          icon={Zap}
          label="Check-in Streak"
          value={`${analytics.streakDays}d`}
          sublabel={`${analytics.totalEntries} total entries`}
          color="#f59e0b"
        />
        <StatCard
          icon={Zap}
          label="Avg Energy"
          value={`${analytics.avgEnergy.toFixed(1)}/10`}
          sublabel="Last 30 days"
          color="#3b82f6"
        />
        <StatCard
          icon={Moon}
          label="Avg Sleep"
          value={`${analytics.avgSleep.toFixed(1)}/10`}
          sublabel="Last 30 days"
          color="#8b5cf6"
        />
      </div>

      {/* Mood Trend Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-sm">Mood Trend</h3>
            <p className="text-gray-400 text-xs mt-0.5">Last 14 days</p>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="h-32">
          <MiniLineChart data={analytics.moodTrendData} height={128} color="#10b981" />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>14d ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Energy & Sleep Charts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <h3 className="text-white font-medium text-xs">Energy</h3>
          </div>
          <MiniLineChart data={analytics.energyTrendData} height={48} color="#3b82f6" />
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <h3 className="text-white font-medium text-xs">Sleep</h3>
          </div>
          <MiniLineChart data={analytics.sleepTrendData} height={48} color="#8b5cf6" />
        </div>
      </div>

      {/* Mood Distribution */}
      {Object.keys(analytics.moodDistribution).length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <h3 className="text-white font-semibold text-sm mb-3">Mood Distribution (30d)</h3>
          <div className="space-y-2">
            {Object.entries(analytics.moodDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([mood, count]) => {
                const percentage = (count / analytics.moodDistribution[Object.keys(analytics.moodDistribution)[0]] * 100);
                return (
                  <div key={mood}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">{mood}</span>
                      <span className="text-gray-300 font-medium">{count} days</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: MOOD_COLORS[mood] || '#6b7280'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Top Triggers */}
      {analytics.topTriggers.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-semibold text-sm">Common Triggers</h3>
          </div>
          <div className="space-y-2">
            {analytics.topTriggers.map(({ trigger, count }) => (
              <div key={trigger} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm capitalize">{trigger}</span>
                <span className="text-orange-400 text-xs font-medium">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Gratitude */}
      {analytics.last7Days.some(e => e.grateful) && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-pink-400" />
            <h3 className="text-white font-semibold text-sm">Recent Gratitude</h3>
          </div>
          <div className="space-y-3">
            {analytics.last7Days
              .filter(e => e.grateful)
              .reverse()
              .slice(0, 3)
              .map((entry, i) => (
                <div key={i} className="border-l-2 border-pink-500/30 pl-3">
                  <p className="text-gray-300 text-sm">{entry.grateful}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="mt-4 bg-gradient-to-br from-emerald-900/20 to-blue-900/20 border border-emerald-700/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-emerald-300 font-semibold text-sm">Insight</h3>
        </div>
        <p className="text-gray-300 text-sm">
          {analytics.moodTrend > 10
            ? `Your mood is improving! You're ${Math.round(analytics.moodTrend)}% better than last month. Keep up the great work!`
            : analytics.moodTrend < -10
            ? `Your mood has been challenging lately. Consider reaching out to your support network or reviewing your tools.`
            : analytics.streakDays >= 7
            ? `Amazing ${analytics.streakDays}-day check-in streak! Consistency is key to recovery.`
            : `You've logged ${analytics.totalEntries} mood check-ins. Keep tracking to see patterns and progress!`}
        </p>
      </div>
    </div>
  );
}
