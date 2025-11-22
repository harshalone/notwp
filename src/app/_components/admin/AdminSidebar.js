'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  Layout,
  Package,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  BookOpen
} from 'lucide-react';

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { account } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dadmin' },
    { icon: FileText, label: 'Posts', href: '/dadmin/posts' },
    { icon: Layout, label: 'Pages', href: '/dadmin/pages' },
    { icon: Image, label: 'Media', href: '/dadmin/media' },
    { icon: Users, label: 'Users', href: '/dadmin/users' },
    { icon: Mail, label: 'Newsletter', href: '/dadmin/newsletter' },
    { icon: BookOpen, label: 'Documentation', href: '/dadmin/documentation' },
    { icon: Package, label: 'Plugins', href: '/dadmin/plugins' },
    { icon: BarChart3, label: 'Analytics', href: '/dadmin/analytics' },
    { icon: Settings, label: 'Settings', href: '/dadmin/settings' },
  ];

  return (
    <aside
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-stone-200 h-screen fixed left-0 top-0 z-50 transition-all duration-300 flex flex-col`}
    >
      {/* Logo and Collapse Button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-stone-900">Admin Panel</h1>
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
      <nav className="py-2 flex-1">
        {menuItems.map((item, index) => {
          const isActive = item.href === '/dadmin'
            ? pathname === '/dadmin'
            : pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={index}
              href={item.href}
              className={`w-full px-4 py-2.5 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-100 text-stone-900 border-r-2 border-stone-900'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info at Bottom */}
      <div className="border-t border-stone-200 p-4">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {account?.displayName || account?.username || 'Admin'}
              </p>
              <p className="text-xs text-stone-500 truncate">{account?.email || ''}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
