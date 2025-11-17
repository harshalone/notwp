'use client';

import { useState } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import { useAuth } from '@/lib/auth-context';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { account } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(account?.displayName || account?.username || '');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

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
            <h1 className="text-3xl font-bold text-stone-900">Profile</h1>
            <p className="text-stone-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="max-w-4xl">
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg border border-stone-200 p-8 mb-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="w-24 h-24 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-white" />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-stone-900">
                            {account?.displayName || account?.username || 'User'}
                          </h2>
                          <p className="text-stone-600 mt-1">{account?.email}</p>
                        </div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors"
                        >
                          Edit Profile
                        </button>
                      </div>
                      {bio && (
                        <p className="text-stone-700 mt-4">{bio}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-lg border border-stone-200 p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">Account Details</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 py-3 border-b border-stone-100">
                  <Mail className="w-5 h-5 text-stone-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Email Address</p>
                    <p className="text-sm text-stone-600">{account?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b border-stone-100">
                  <User className="w-5 h-5 text-stone-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Username</p>
                    <p className="text-sm text-stone-600">{account?.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-b border-stone-100">
                  <Shield className="w-5 h-5 text-stone-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Role</p>
                    <p className="text-sm text-stone-600">Administrator</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <Calendar className="w-5 h-5 text-stone-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">Member Since</p>
                    <p className="text-sm text-stone-600">
                      {account?.createdAt
                        ? new Date(account.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
