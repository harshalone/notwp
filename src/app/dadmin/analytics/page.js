'use client';

import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { BarChart3, TrendingUp, Users, Eye, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Analytics</h1>
              <p className="text-stone-600 mt-2">Track your site performance and visitor insights</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Last 30 Days
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">+12%</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">45.2K</p>
              <p className="text-sm text-stone-600 mt-1">Page Views</p>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">+8%</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">12.4K</p>
              <p className="text-sm text-stone-600 mt-1">Visitors</p>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs text-green-600 font-medium">+15%</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">3.2K</p>
              <p className="text-sm text-stone-600 mt-1">Conversions</p>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-xs text-red-600 font-medium">-2%</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">2:45</p>
              <p className="text-sm text-stone-600 mt-1">Avg. Duration</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white rounded-lg border border-stone-200 p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-stone-400" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Analytics Dashboard</h2>
              <p className="text-stone-600 mb-6">Detailed charts and insights coming soon</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
