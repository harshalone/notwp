'use client';

import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { Settings as SettingsIcon, Save, Globe, Lock, Bell, Palette, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Settings</h1>
              <p className="text-stone-600 mt-2">Configure your site settings and preferences</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          {/* Settings Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">General</h3>
              <p className="text-sm text-stone-600">Site name, tagline, and basic configuration</p>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Security</h3>
              <p className="text-sm text-stone-600">Password, authentication, and security options</p>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Notifications</h3>
              <p className="text-sm text-stone-600">Email alerts and notification preferences</p>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Appearance</h3>
              <p className="text-sm text-stone-600">Theme, colors, and visual customization</p>
            </div>

            {/* Database Settings */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Database</h3>
              <p className="text-sm text-stone-600">Database configuration and optimization</p>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <SettingsIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Advanced</h3>
              <p className="text-sm text-stone-600">Developer tools and advanced options</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
