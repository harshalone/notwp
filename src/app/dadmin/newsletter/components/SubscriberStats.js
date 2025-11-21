'use client';

import { Users, Mail, TrendingUp, UserCheck } from 'lucide-react';

export default function SubscriberStats({ stats }) {
  const statCards = [
    {
      title: 'Total Subscribers',
      value: stats.total || 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-800',
      iconBg: 'bg-blue-50'
    },
    {
      title: 'Active Subscribers',
      value: stats.active || 0,
      icon: UserCheck,
      color: 'bg-green-100 text-green-800',
      iconBg: 'bg-green-50'
    },
    {
      title: 'This Month',
      value: stats.thisMonth || 0,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-800',
      iconBg: 'bg-purple-50'
    },
    {
      title: 'Emails Sent',
      value: stats.emailsSent || 0,
      icon: Mail,
      color: 'bg-orange-100 text-orange-800',
      iconBg: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="bg-white rounded-lg border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color.split(' ')[1]}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 mb-1">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-stone-600">{stat.title}</div>
          </div>
        );
      })}
    </div>
  );
}
