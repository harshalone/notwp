'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Navigation, Palette, Mail, Shield, Globe, Sliders } from 'lucide-react';

const settingsSections = [
  {
    name: 'General',
    path: '/dadmin/settings',
    icon: Settings,
    description: 'Basic site settings'
  },
  {
    name: 'Navigation',
    path: '/dadmin/settings/sections/navigation',
    icon: Navigation,
    description: 'Menu and navigation settings'
  },
//   {
//     name: 'Appearance',
//     path: '/dadmin/settings/sections/appearance',
//     icon: Palette,
//     description: 'Theme and styling'
//   },
//   {
//     name: 'SEO',
//     path: '/dadmin/settings/sections/seo',
//     icon: Globe,
//     description: 'Search engine optimization'
//   },
//   {
//     name: 'Email',
//     path: '/dadmin/settings/sections/email',
//     icon: Mail,
//     description: 'Email configuration'
//   },
//   {
//     name: 'Security',
//     path: '/dadmin/settings/sections/security',
//     icon: Shield,
//     description: 'Security settings'
//   },
//   {
//     name: 'Advanced',
//     path: '/dadmin/settings/sections/advanced',
//     icon: Sliders,
//     description: 'Advanced options'
//   }
];

export default function TopBar() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-stone-200">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Settings</h1>
            <p className="text-stone-600 mt-1">Configure your site settings and preferences</p>
          </div>
        </div>

        {/* Settings Navigation Menu */}
        <nav className="flex gap-1 overflow-x-auto">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = pathname === section.path;

            return (
              <Link
                key={section.path}
                href={section.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                  ${isActive
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }
                `}
                title={section.description}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
