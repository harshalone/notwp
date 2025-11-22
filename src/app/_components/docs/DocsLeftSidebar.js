'use client';

import { useState } from 'react';

export default function DocsLeftSidebar({ docs, activeSlug, onDocSelect }) {
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  const toggleSection = (docId) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(docId)) {
      newCollapsed.delete(docId);
    } else {
      newCollapsed.add(docId);
    }
    setCollapsedSections(newCollapsed);
  };

  const renderDocItem = (doc, level = 0) => {
    const hasChildren = doc.children && doc.children.length > 0;
    const isActive = activeSlug === doc.slug;
    const isCollapsed = collapsedSections.has(doc.id);

    return (
      <div key={doc.id} className="w-full">
        <div className="flex items-center group">
          {hasChildren && (
            <button
              onClick={() => toggleSection(doc.id)}
              className="cursor-pointer p-1 hover:bg-gray-100 rounded mr-1 transition-colors"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg
                className={`w-3 h-3 text-gray-500 transition-transform ${
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDocSelect(doc.slug)}
            className={`cursor-pointer flex-1 text-left text-sm py-1.5 px-2 rounded transition-colors ${
              level > 0 ? 'ml-4' : ''
            } ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {doc.title}
          </button>
        </div>
        {hasChildren && !isCollapsed && (
          <div className="mt-0.5">
            {doc.children.map((child) => renderDocItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <div className="block mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Documentation</h2>
        </div>
        <nav className="space-y-0.5">
          {docs && docs.length > 0 ? (
            docs.map((doc) => renderDocItem(doc))
          ) : (
            <p className="text-sm text-gray-500 italic">No documentation available</p>
          )}
        </nav>
      </div>
    </aside>
  );
}
