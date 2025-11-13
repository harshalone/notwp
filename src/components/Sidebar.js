'use client';

import { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  Users,
  Settings,
  Layout,
  Tag,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: FileText, label: 'Posts', active: true },
    { icon: Image, label: 'Media', active: false },
    { icon: Video, label: 'Videos', active: false },
    { icon: Layout, label: 'Pages', active: false },
    { icon: MessageSquare, label: 'Comments', active: false },
    { icon: Tag, label: 'Tags', active: false },
    { icon: Users, label: 'Users', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-stone-200 h-screen fixed left-0 top-0 z-50 transition-all duration-300`}
    >
      {/* Logo and Collapse Button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-stone-900">NotWordPress</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto p-1.5 rounded-md hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="py-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full px-4 py-2.5 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all cursor-pointer ${
              item.active
                ? 'bg-stone-100 text-stone-900 border-r-2 border-stone-900'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
