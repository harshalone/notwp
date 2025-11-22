'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DocsRightSidebar({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Extract headings from content if it's HTML or markdown
    // This will work with the JSONB content structure
    const extractHeadings = () => {
      // Wait for DOM to be ready
      const contentElement = document.querySelector('.docs-content');
      if (!contentElement) return [];

      const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4');
      const headingsArray = Array.from(headingElements).map((heading, index) => {
        // Generate ID if not exists
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
        return {
          id: heading.id,
          text: heading.textContent,
          level: parseInt(heading.tagName.substring(1)),
        };
      });

      return headingsArray;
    };

    // Extract headings after a short delay to ensure content is rendered
    const timer = setTimeout(() => {
      const extracted = extractHeadings();
      setHeadings(extracted);
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <aside className="w-auto h-[calc(100vh-4rem)] sticky top-16 border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0 hidden xl:block">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
          On This Page
        </h3>
        <nav>
          <ul className="space-y-1.5">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 1) * 8}px` }}
              >
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`cursor-pointer text-left text-xs transition-colors block w-full ${
                    activeId === heading.id
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
