'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import TopBar from "./components/TopBar";
import { Settings as SettingsIcon, Save, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form state for new/edit setting
  const [formData, setFormData] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'string',
    description: '',
    is_public: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/list');
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      } else {
        showNotification('Failed to fetch settings', 'error');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showNotification('Error fetching settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSetting = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = editingSetting
        ? { id: editingSetting.id, ...formData }
        : formData;

      const response = await fetch('/api/settings/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(data.message, 'success');
        await fetchSettings();
        closeModal();
      } else {
        showNotification(data.error || 'Failed to save setting', 'error');
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      showNotification('Error saving setting', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSetting = async (id) => {
    if (!confirm('Are you sure you want to delete this setting?')) {
      return;
    }

    try {
      const response = await fetch(`/api/settings/delete?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showNotification(data.message, 'success');
        await fetchSettings();
      } else {
        showNotification(data.error || 'Failed to delete setting', 'error');
      }
    } catch (error) {
      console.error('Error deleting setting:', error);
      showNotification('Error deleting setting', 'error');
    }
  };

  const handleEditSetting = (setting) => {
    setEditingSetting(setting);
    setFormData({
      setting_key: setting.setting_key,
      setting_value: setting.setting_value || '',
      setting_type: setting.setting_type || 'string',
      description: setting.description || '',
      is_public: setting.is_public || false,
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingSetting(null);
    setFormData({
      setting_key: '',
      setting_value: '',
      setting_type: 'string',
      description: '',
      is_public: false,
    });
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getTypeBadge = (type) => {
    const styles = {
      string: 'bg-blue-100 text-blue-800 border-blue-200',
      number: 'bg-purple-100 text-purple-800 border-purple-200',
      boolean: 'bg-green-100 text-green-800 border-green-200',
      json: 'bg-orange-100 text-orange-800 border-orange-200',
      encrypted: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[type] || styles.string}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        {/* Settings Navigation Bar */}
        <div className="pt-16">
          <TopBar />
        </div>

        <main className="px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">General Settings</h2>
              <p className="text-stone-600 mt-1">Manage all your site settings</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Setting
            </button>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-4 p-4 rounded-lg border ${
              notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Settings Table */}
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
                <p className="text-stone-600 mt-4">Loading settings...</p>
              </div>
            ) : settings.length === 0 ? (
              <div className="p-12 text-center">
                <SettingsIcon className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">No settings found</h3>
                <p className="text-stone-600">Click "Add Setting" to create your first setting</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Key
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Public
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {settings.map((setting) => (
                      <tr key={setting.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-stone-900">
                            {setting.setting_key}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-stone-600 max-w-xs truncate">
                            {setting.setting_type === 'encrypted'
                              ? '••••••••'
                              : setting.setting_value || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTypeBadge(setting.setting_type)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-stone-600 max-w-xs truncate">
                            {setting.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {setting.is_public ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-stone-400" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditSetting(setting)}
                              className="p-1 hover:bg-stone-100 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-stone-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteSetting(setting.id)}
                              className="p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200">
              <h2 className="text-xl font-bold text-stone-900">
                {editingSetting ? 'Edit Setting' : 'Add New Setting'}
              </h2>
            </div>

            <form onSubmit={handleSaveSetting} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Setting Key *
                </label>
                <input
                  type="text"
                  value={formData.setting_key}
                  onChange={(e) => setFormData({ ...formData, setting_key: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                  placeholder="e.g., app_name, max_upload_size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Setting Value
                </label>
                <input
                  type="text"
                  value={formData.setting_value}
                  onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  placeholder="Enter value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Setting Type
                </label>
                <select
                  value={formData.setting_type}
                  onChange={(e) => setFormData({ ...formData, setting_type: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="json">JSON</option>
                  <option value="encrypted">Encrypted</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  rows={3}
                  placeholder="Describe what this setting does"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-900"
                />
                <label htmlFor="is_public" className="text-sm font-medium text-stone-700">
                  Make this setting public (visible to unauthenticated users)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingSetting ? 'Update Setting' : 'Add Setting'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
