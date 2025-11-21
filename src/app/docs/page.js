import Navigation from '../_components/landing/Navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Documentation - NotWP',
  description: 'Learn how to use NotWP and explore our comprehensive documentation',
};

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of NotWP and get started quickly',
      items: [
        { title: 'Introduction', href: '/docs/introduction' },
        { title: 'Quick Start Guide', href: '/docs/quick-start' },
        { title: 'Installation', href: '/docs/installation' },
      ]
    },
    {
      title: 'Features',
      description: 'Explore the powerful features of NotWP',
      items: [
        { title: 'Page Builder', href: '/docs/page-builder' },
        { title: 'Content Management', href: '/docs/content-management' },
        { title: 'Blog System', href: '/docs/blog-system' },
      ]
    },
    {
      title: 'Guides',
      description: 'Step-by-step guides for common tasks',
      items: [
        { title: 'Creating Your First Page', href: '/docs/creating-pages' },
        { title: 'Writing Blog Posts', href: '/docs/writing-posts' },
        { title: 'Customization', href: '/docs/customization' },
      ]
    },
    {
      title: 'API Reference',
      description: 'Technical documentation and API references',
      items: [
        { title: 'API Overview', href: '/docs/api-overview' },
        { title: 'Authentication', href: '/docs/authentication' },
        { title: 'Components', href: '/docs/components' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about using NotWP. From getting started to advanced features.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-4 top-4 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {section.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {section.description}
              </p>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Need More Help?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our community is here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/blog"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Visit Blog
            </Link>
            <Link
              href="/editor"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
