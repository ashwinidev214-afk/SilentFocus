'use client';

import { 
  Users, 
  UserRound, 
  CalendarCheck, 
  DollarSign, 
  Activity, 
  Map 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import MetricCard from '@/components/MetricCard';

const data = [
  { name: 'Jan', revenue: 4000, bookings: 240 },
  { name: 'Feb', revenue: 3000, bookings: 198 },
  { name: 'Mar', revenue: 2000, bookings: 980 },
  { name: 'Apr', revenue: 2780, bookings: 390 },
  { name: 'May', revenue: 1890, bookings: 480 },
  { name: 'Jun', revenue: 2390, bookings: 380 },
  { name: 'Jul', revenue: 3490, bookings: 430 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Super Admin. Here is what's happening today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Users" 
          value="1,284" 
          icon={<Users size={24} />} 
          trend={{ value: 12, isPositive: true }}
          description="vs last month"
        />
        <MetricCard 
          title="Total Hosts" 
          value="156" 
          icon={<UserRound size={24} />} 
          trend={{ value: 5, isPositive: true }}
          description="vs last month"
        />
        <MetricCard 
          title="Total Bookings" 
          value="3,420" 
          icon={<CalendarCheck size={24} />} 
          trend={{ value: 18, isPositive: true }}
          description="vs last month"
        />
        <MetricCard 
          title="Total Revenue" 
          value="$45,200" 
          icon={<DollarSign size={24} />} 
          trend={{ value: 24, isPositive: true }}
          description="vs last month"
        />
        <MetricCard 
          title="Active Experiences" 
          value="84" 
          icon={<Activity size={24} />} 
          description="Currently live"
        />
        <MetricCard 
          title="Active Retreats" 
          value="42" 
          icon={<Map size={24} />} 
          description="Upcoming events"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Revenue Over Time</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Bookings Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
