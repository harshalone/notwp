'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import {
  Plus, Search, Filter, Calendar, Mail,
  Send, MessageSquare, ShoppingCart, ClipboardList, Newspaper,
  TrendingUp, Users, Zap, CreditCard, BarChart3, Settings,
  MessagesSquare, CalendarDays, UsersRound, MessageCircle, Headphones, FileText
} from 'lucide-react';

// Icon mapping
const iconMap = {
  Calendar,
  Mail,
  Send,
  MessageSquare,
  ShoppingCart,
  ClipboardList,
  Newspaper,
  TrendingUp,
  Users,
  Zap,
  CreditCard,
  BarChart3,
  MessagesSquare,
  CalendarDays,
  UsersRound,
  MessageCircle,
  Headphones,
  FileText
};

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plugins');
      const data = await response.json();

      if (data.success) {
        // Map icon strings to actual icon components
        const pluginsWithIcons = data.plugins.map(plugin => ({
          ...plugin,
          iconComponent: iconMap[plugin.icon] || FileText
        }));
        setPlugins(pluginsWithIcons);
      } else {
        setError(data.error || 'Failed to fetch plugins');
      }
    } catch (err) {
      console.error('Error fetching plugins:', err);
      setError('Failed to load plugins');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInstall = async (pluginId, currentStatus) => {
    try {
      const response = await fetch('/api/plugins', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pluginId,
          installed: !currentStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setPlugins(plugins.map(plugin =>
          plugin.id === pluginId
            ? { ...plugin, installed: !currentStatus }
            : plugin
        ));
      } else {
        alert(data.error || 'Failed to update plugin');
      }
    } catch (err) {
      console.error('Error updating plugin:', err);
      alert('Failed to update plugin');
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader />
          <main className="pt-20 px-8 pb-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading plugins...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader />
          <main className="pt-20 px-8 pb-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchPlugins}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Plugins</h1>
              <p className="text-stone-600 mt-2">Extend your site with plugins</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
              <Plus className="w-4 h-4" />
              Add New Plugin
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Plugin Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {plugins.map((plugin) => {
              const IconComponent = plugin.iconComponent;
              return (
                <div
                  key={plugin.id}
                  className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-stone-300 group flex flex-col"
                >
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-stone-900 transition-colors duration-200">
                    <IconComponent className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    {plugin.name}
                  </h3>
                  <p className="text-sm text-stone-600 mb-4 flex-grow">
                    {plugin.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                        {plugin.category}
                      </span>
                    </div>
                    {plugin.installed ? (
                      <button
                        onClick={() => handleToggleInstall(plugin.id, plugin.installed)}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Installed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleInstall(plugin.id, plugin.installed)}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 border border-stone-900 text-stone-900 rounded-lg hover:bg-stone-900 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Install
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
