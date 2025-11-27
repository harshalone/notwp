'use client';

import { useState, useEffect, useRef } from 'react';
import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import TopBar from "../../components/TopBar";
import { Save, Plus, Trash2, Edit2, GripVertical, ExternalLink, Search, Link2, FileText } from 'lucide-react';

export default function NavigationSettingsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState(null);

  // Pages selection state
  const [linkType, setLinkType] = useState('url'); // 'url' or 'page'
  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [pageSearch, setPageSearch] = useState('');
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const dropdownRef = useRef(null);

  // Form state for new/edit menu item
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    target: '_self',
    order: 0,
    parent_id: null,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch pages when modal opens and link type is 'page'
  useEffect(() => {
    if (showAddModal && linkType === 'page') {
      fetchPages();
    }
  }, [showAddModal, linkType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPageDropdown(false);
      }
    };

    if (showPageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPageDropdown]);

  const fetchPages = async () => {
    setLoadingPages(true);
    try {
      const response = await fetch('/api/pages/list');
      const data = await response.json();

      if (data.success) {
        setPages(data.pages || []);
      } else {
        console.error('Failed to fetch pages');
        setPages([]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setPages([]);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/navigation/list');
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.items || []);
      } else {
        showNotification('Failed to fetch navigation items', 'error');
      }
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      // For now, set empty array if API doesn't exist
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();

    // Validate that a page is selected when link type is 'page'
    if (linkType === 'page' && !selectedPage) {
      showNotification('Please select a page', 'error');
      return;
    }

    setSaving(true);

    try {
      const payload = editingItem
        ? { id: editingItem.id, ...formData }
        : formData;

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/navigation/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showNotification(data.message || 'Menu item saved successfully', 'success');
        await fetchMenuItems();
        closeModal();
      } else {
        showNotification(data.error || 'Failed to save menu item', 'error');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      showNotification('Error saving menu item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/navigation/delete?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showNotification(data.message || 'Menu item deleted successfully', 'success');
        await fetchMenuItems();
      } else {
        showNotification(data.error || 'Failed to delete menu item', 'error');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      showNotification('Error deleting menu item', 'error');
    }
  };

  const handleEditMenuItem = async (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      url: item.url,
      target: item.target || '_self',
      order: item.order || 0,
      parent_id: item.parent_id || null,
    });

    // Detect if URL is an external link or internal page
    const isExternalUrl = item.url.startsWith('http://') || item.url.startsWith('https://');
    const detectedLinkType = isExternalUrl ? 'url' : 'page';
    setLinkType(detectedLinkType);

    // If it's a page link, try to find the matching page
    if (detectedLinkType === 'page') {
      try {
        const response = await fetch('/api/pages/list');
        const data = await response.json();

        if (data.success && data.pages) {
          setPages(data.pages);
          // Find the page that matches this URL
          const slug = item.url.replace(/^\//, ''); // Remove leading slash
          const matchingPage = data.pages.find(p => p.slug === slug);
          if (matchingPage) {
            setSelectedPage(matchingPage);
          }
        }
      } catch (error) {
        console.error('Error fetching pages for edit:', error);
      }
    }

    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormData({
      label: '',
      url: '',
      target: '_self',
      order: 0,
      parent_id: null,
    });
    setLinkType('url');
    setPageSearch('');
    setShowPageDropdown(false);
    setSelectedPage(null);
  };

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setFormData({
      ...formData,
      url: `/${page.slug}`,
      label: formData.label || page.title // Auto-fill label if empty
    });
    setShowPageDropdown(false);
    setPageSearch('');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
              <h2 className="text-2xl font-bold text-stone-900">Navigation Settings</h2>
              <p className="text-stone-600 mt-1">Manage your site's navigation menu items</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Menu Item
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

          {/* Menu Items Table */}
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
                <p className="text-stone-600 mt-4">Loading navigation items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="p-12 text-center">
                <GripVertical className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">No menu items found</h3>
                <p className="text-stone-600">Click "Add Menu Item" to create your first navigation item</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Label
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-stone-400" />
                            <span className="text-sm text-stone-900">{item.order}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-stone-900">
                            {item.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-stone-600 max-w-xs truncate">
                            {item.url}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-stone-600">
                            {item.target === '_blank' ? (
                              <span className="flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                New Tab
                              </span>
                            ) : (
                              'Same Tab'
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditMenuItem(item)}
                              className="p-1 hover:bg-stone-100 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-stone-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
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
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
            </div>

            <form onSubmit={handleSaveMenuItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                  placeholder="e.g., Home, About, Contact"
                />
              </div>

              {/* Link Type Selector */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Link Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkType('url')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                      linkType === 'url'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkType('page')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                      linkType === 'page'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Pages
                  </button>
                </div>
              </div>

              {/* URL Input (when linkType is 'url') */}
              {linkType === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    URL *
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                    required
                    placeholder="/about, https://example.com"
                  />
                </div>
              )}

              {/* Page Selector (when linkType is 'page') */}
              {linkType === 'page' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Select Page *
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => setShowPageDropdown(!showPageDropdown)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-900 bg-white cursor-pointer flex items-center justify-between"
                    >
                      <span className={selectedPage ? 'text-stone-900' : 'text-stone-400'}>
                        {selectedPage ? selectedPage.title : 'Search and select a page...'}
                      </span>
                      <Search className="w-4 h-4 text-stone-400" />
                    </div>

                    {/* Dropdown */}
                    {showPageDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                        {/* Search Input */}
                        <div className="p-2 border-b border-stone-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                              type="text"
                              value={pageSearch}
                              onChange={(e) => setPageSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm"
                              placeholder="Search pages..."
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Pages List */}
                        <div className="overflow-y-auto">
                          {loadingPages ? (
                            <div className="p-4 text-center">
                              <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
                              <p className="text-sm text-stone-600 mt-2">Loading pages...</p>
                            </div>
                          ) : pages.filter(page =>
                              page.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
                              page.slug.toLowerCase().includes(pageSearch.toLowerCase())
                            ).length === 0 ? (
                            <div className="p-4 text-center text-sm text-stone-500">
                              No pages found
                            </div>
                          ) : (
                            pages
                              .filter(page =>
                                page.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
                                page.slug.toLowerCase().includes(pageSearch.toLowerCase())
                              )
                              .map((page) => (
                                <button
                                  key={page.id}
                                  type="button"
                                  onClick={() => handlePageSelect(page)}
                                  className="w-full px-4 py-2 text-left hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0"
                                >
                                  <div className="font-medium text-stone-900 text-sm">{page.title}</div>
                                  <div className="text-xs text-stone-500 mt-0.5">/{page.slug}</div>
                                </button>
                              ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedPage && (
                    <p className="text-xs text-stone-500 mt-1">
                      Selected: /{selectedPage.slug}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Target
                </label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  <option value="_self">Same Tab</option>
                  <option value="_blank">New Tab</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  placeholder="0"
                />
                <p className="text-xs text-stone-500 mt-1">Lower numbers appear first</p>
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
                      {editingItem ? 'Update Menu Item' : 'Add Menu Item'}
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
