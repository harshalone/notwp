'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Mail, Users, Send, ArrowRight, Settings, FileSpreadsheet, Import } from 'lucide-react';
import Link from 'next/link';
import SubscriberStats from './components/SubscriberStats';

export default function NewsletterPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    thisMonth: 0,
    emailsSent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationCards = [
    {
      title: 'Subscribers',
      description: 'View and manage all your newsletter subscribers',
      icon: Users,
      href: '/dadmin/newsletter/subscribers',
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100 hover:border-blue-300',
      count: stats.active
    },
    {
      title: 'Compose Email',
      description: 'Create and send emails to your subscribers',
      icon: Send,
      href: '/dadmin/newsletter/compose',
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-100 hover:border-green-300',
      count: null
    },
    {
      title: 'Import & Export',
      description: 'Import subscribers from CSV or export your list',
      icon: FileSpreadsheet,
      href: '/dadmin/newsletter/import-export',
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-100 hover:border-orange-300',
      count: null
    },
    {
      title: 'Email Settings',
      description: 'Configure AWS SES for sending newsletters',
      icon: Settings,
      href: '/dadmin/newsletter/settings',
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100 hover:border-purple-300',
      count: null
    }
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-stone-900 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">Newsletter</h1>
                  <p className="text-stone-600">
                    Manage subscribers and send email campaigns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dadmin/newsletter/import-export"
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
                >
                  <Import className="w-4 h-4" />
                  Import/Export
                </Link>

                <Link
                  href="/dadmin/newsletter/settings"
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link
                  href="/dadmin/newsletter/subscribers"
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-200 hover:border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:text-stone-900 transition-all"
                >
                  <Users className="w-4 h-4" />
                  Subscribers
                </Link>
                <Link
                  href="/dadmin/newsletter/compose"
                  className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 rounded-lg text-sm font-medium text-white transition-all"
                >
                  <Send className="w-4 h-4" />
                  Compose
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="bg-white rounded-lg border border-stone-200 p-12 mb-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading newsletter data...</p>
              </div>
            </div>
          ) : (
            <>
              <SubscriberStats stats={stats} />

              {/* Navigation Cards */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-stone-900">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {navigationCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <Link
                        key={card.href}
                        href={card.href}
                        className={`bg-white rounded-lg border-2 ${card.borderColor} p-6 transition-all hover:shadow-md group`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="text-lg font-semibold text-stone-900 mb-2">
                          {card.title}
                          {card.count !== null && (
                            <span className="ml-2 text-sm font-normal text-stone-500">
                              ({card.count})
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-stone-600">{card.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Info Card */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Email Service Setup</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Configure AWS SES to start sending newsletter emails to your subscribers.
                      </p>
                      <Link
                        href="/dadmin/newsletter/settings"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
                      >
                        <Settings className="w-4 h-4" />
                        Configure Email Settings
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
