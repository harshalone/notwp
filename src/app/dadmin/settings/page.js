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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Settings</h1>
            <p className="text-stone-600 mt-2">Configure your site settings and preferences</p>
          </div>

          {/* Coming Soon */}
          <div className="bg-white rounded-lg border border-stone-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SettingsIcon className="w-8 h-8 text-stone-400" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Coming Soon</h2>
              <p className="text-stone-600">Settings page is currently under development</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
