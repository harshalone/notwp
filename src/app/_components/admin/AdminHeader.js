'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminHeader() {
  const { account, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appVersion, setAppVersion] = useState(null);

  useEffect(() => {
    const fetchAppVersion = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        if (data.status === 'ok' && data.app_version) {
          console.log('App Version:', data);
          setAppVersion(data.app_version);
        }
      } catch (error) {
        console.error('Error fetching app version:', error);
      }
    };

    fetchAppVersion();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* App Version */}
        {appVersion && (
          <div className="px-3 py-1 rounded-md bg-stone-100">
            <span className="text-xs font-medium text-stone-600">
              v{appVersion}
            </span>
          </div>
        )}

        {/* Help Button */}
        <button
          className="p-2 rounded-md hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-stone-200 py-2">
              <div className="px-4 py-2 border-b border-stone-200">
                <h3 className="text-sm font-semibold text-stone-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-stone-50 cursor-pointer">
                  <p className="text-sm text-stone-900">New comment on your post</p>
                  <p className="text-xs text-stone-500 mt-1">2 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-stone-50 cursor-pointer">
                  <p className="text-sm text-stone-900">New user registered</p>
                  <p className="text-xs text-stone-500 mt-1">1 hour ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-stone-50 cursor-pointer">
                  <p className="text-sm text-stone-900">Server update completed</p>
                  <p className="text-xs text-stone-500 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div> 
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2">
              <Link
                href="/dadmin/profile"
                className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                onClick={() => setShowUserMenu(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                href="/dadmin/settings"
                className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <hr className="my-2 border-stone-200" />
              <button
                onClick={signOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
