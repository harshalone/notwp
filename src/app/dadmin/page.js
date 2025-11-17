'use client';

import { useState } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <AdminHeader />

        {/* Main Content */}
        <main className="pt-20 px-8 pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
            <p className="text-stone-600 mt-2">Welcome back! Here's what's happening with your site.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Posts */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Total Posts</p>
                  <p className="text-3xl font-bold text-stone-900 mt-2">142</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Total Users</p>
                  <p className="text-3xl font-bold text-stone-900 mt-2">1,234</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+8% from last month</span>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Comments</p>
                  <p className="text-3xl font-bold text-stone-900 mt-2">856</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-red-600">-3% from last month</span>
              </div>
            </div>

            {/* Page Views */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Page Views</p>
                  <p className="text-3xl font-bold text-stone-900 mt-2">45.2K</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">+24% from last month</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Posts */}
            <div className="bg-white rounded-lg border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900">Recent Posts</h2>
              </div>
              <div className="divide-y divide-stone-200">
                <div className="p-4 hover:bg-stone-50 cursor-pointer">
                  <h3 className="text-sm font-medium text-stone-900">Getting Started with NotWP</h3>
                  <p className="text-xs text-stone-500 mt-1">Published 2 hours ago</p>
                </div>
                <div className="p-4 hover:bg-stone-50 cursor-pointer">
                  <h3 className="text-sm font-medium text-stone-900">10 Tips for Better Content</h3>
                  <p className="text-xs text-stone-500 mt-1">Published 5 hours ago</p>
                </div>
                <div className="p-4 hover:bg-stone-50 cursor-pointer">
                  <h3 className="text-sm font-medium text-stone-900">Why We Built NotWP</h3>
                  <p className="text-xs text-stone-500 mt-1">Published 1 day ago</p>
                </div>
              </div>
            </div>

            {/* Recent Comments */}
            <div className="bg-white rounded-lg border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900">Recent Comments</h2>
              </div>
              <div className="divide-y divide-stone-200">
                <div className="p-4 hover:bg-stone-50 cursor-pointer">
                  <p className="text-sm text-stone-900">Great article! Very helpful...</p>
                  <p className="text-xs text-stone-500 mt-1">John Doe - 10 minutes ago</p>
                </div>
                <div className="p-4 hover:bg-stone-50 cursor-pointer">
                  <p className="text-sm text-stone-900">Thanks for sharing this...</p>
                  <p className="text-xs text-stone-500 mt-1">Jane Smith - 1 hour ago</p>
                </div>
                <div className="p-4 hover:bg-stone-50 cursor-pointer">
                  <p className="text-sm text-stone-900">Looking forward to more content...</p>
                  <p className="text-xs text-stone-500 mt-1">Bob Johnson - 3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
