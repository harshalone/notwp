'use client';

import AdminSidebar from "@/app/_components/admin/AdminSidebar";
import AdminHeader from "@/app/_components/admin/AdminHeader";
import {
  Plus, Search, Filter, Calendar, Mail,
  Send, MessageSquare, ShoppingCart, ClipboardList, Newspaper,
  TrendingUp, Users, Zap, CreditCard, BarChart3, Settings
} from 'lucide-react';

const plugins = [
  {
    id: 1,
    name: 'Cal.com',
    description: 'Scheduling and booking tool for appointments',
    icon: Calendar,
    category: 'Productivity',
    installed: true
  },
  {
    id: 2,
    name: 'Gmail Integration',
    description: 'Connect and manage your Gmail account',
    icon: Mail,
    category: 'Communication',
    installed: false
  },
  {
    id: 3,
    name: 'Email Marketing',
    description: 'Create and send email campaigns',
    icon: Send,
    category: 'Marketing',
    installed: true
  },
  {
    id: 4,
    name: 'Testimonial Tool',
    description: 'Collect and display customer testimonials',
    icon: MessageSquare,
    category: 'Content',
    installed: false
  },
  {
    id: 5,
    name: 'Newsletter',
    description: 'Build and manage newsletter subscriptions',
    icon: Newspaper,
    category: 'Marketing',
    installed: true
  },
  {
    id: 6,
    name: 'eCommerce Tool',
    description: 'Add shopping cart and payment features',
    icon: ShoppingCart,
    category: 'Sales',
    installed: false
  },
  {
    id: 7,
    name: 'Quiz Builder',
    description: 'Create interactive quizzes and surveys',
    icon: ClipboardList,
    category: 'Engagement',
    installed: false
  },
  {
    id: 8,
    name: 'Analytics Pro',
    description: 'Advanced analytics and insights',
    icon: BarChart3,
    category: 'Analytics',
    installed: true
  },
  {
    id: 9,
    name: 'SEO Optimizer',
    description: 'Optimize your site for search engines',
    icon: TrendingUp,
    category: 'SEO',
    installed: false
  },
  {
    id: 10,
    name: 'User Management',
    description: 'Manage users and permissions',
    icon: Users,
    category: 'Admin',
    installed: true
  },
  {
    id: 11,
    name: 'Automation Hub',
    description: 'Automate workflows and tasks',
    icon: Zap,
    category: 'Productivity',
    installed: false
  },
  {
    id: 12,
    name: 'Payment Gateway',
    description: 'Accept payments securely',
    icon: CreditCard,
    category: 'Sales',
    installed: false
  }
];

export default function PluginsPage() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <main className="pt-20 px-8 pb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Plugins</h1>
              <p className="text-stone-600 mt-2">Extend your site with plugins</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
              <Plus className="w-4 h-4" />
              Add New Plugin
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Plugin Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {plugins.map((plugin) => {
              const IconComponent = plugin.icon;
              return (
                <div
                  key={plugin.id}
                  className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-stone-300 group flex flex-col"
                >
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-stone-900 transition-colors duration-200">
                    <IconComponent className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    {plugin.name}
                  </h3>
                  <p className="text-sm text-stone-600 mb-4 flex-grow">
                    {plugin.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                        {plugin.category}
                      </span>
                    </div>
                    {plugin.installed ? (
                      <button className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors">
                        <Settings className="w-4 h-4" />
                        Installed
                      </button>
                    ) : (
                      <button className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 border border-stone-900 text-stone-900 rounded-lg hover:bg-stone-900 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                        Install
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
