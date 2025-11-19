'use client';

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { puckComponents } from './puck-components';
import { createAiPlugin } from "@puckeditor/plugin-ai";
import "@puckeditor/plugin-ai/styles.css";

// Define your component blocks - now using imported components plus some basic blocks
const config = {
  components: {
    // Basic building blocks
    HeadingBlock: {
      fields: {
        children: { type: "text", label: "Heading Text" },
        level: {
          type: "select",
          options: [
            { label: "Heading 1", value: "h1" },
            { label: "Heading 2", value: "h2" },
            { label: "Heading 3", value: "h3" },
            { label: "Heading 4", value: "h4" },
          ],
          label: "Heading Level"
        },
      },
      defaultProps: {
        children: "Heading",
        level: "h1",
      },
      render: ({ children, level }) => {
        const Tag = level;
        const classMap = {
          h1: "text-4xl font-bold mb-4",
          h2: "text-3xl font-bold mb-3",
          h3: "text-2xl font-semibold mb-2",
          h4: "text-xl font-semibold mb-2",
        };
        return <Tag className={classMap[level]}>{children}</Tag>;
      },
    },
    TextBlock: {
      fields: {
        text: {
          type: "textarea",
          label: "Text Content"
        },
        align: {
          type: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
          label: "Text Alignment"
        },
      },
      defaultProps: {
        text: "Enter your text here...",
        align: "left",
      },
      render: ({ text, align }) => {
        const alignClass = {
          left: "text-left",
          center: "text-center",
          right: "text-right",
        };
        return (
          <p className={`mb-4 ${alignClass[align]}`}>
            {text}
          </p>
        );
      },
    },
    ImageBlock: {
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        width: {
          type: "select",
          options: [
            { label: "Full Width", value: "full" },
            { label: "Large", value: "large" },
            { label: "Medium", value: "medium" },
            { label: "Small", value: "small" },
          ],
          label: "Image Width"
        },
      },
      defaultProps: {
        src: "https://via.placeholder.com/800x400",
        alt: "Placeholder image",
        width: "full",
      },
      render: ({ src, alt, width }) => {
        const widthClass = {
          full: "w-full",
          large: "w-3/4 mx-auto",
          medium: "w-1/2 mx-auto",
          small: "w-1/3 mx-auto",
        };
        return (
          <div className={`mb-4 ${widthClass[width]}`}>
            <img
              src={src}
              alt={alt}
              className="rounded-lg w-full h-auto"
            />
          </div>
        );
      },
    },
    ButtonBlock: {
      fields: {
        text: { type: "text", label: "Button Text" },
        link: { type: "text", label: "Button Link" },
        style: {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
          label: "Button Style"
        },
      },
      defaultProps: {
        text: "Click Me",
        link: "#",
        style: "primary",
      },
      render: ({ text, link, style }) => {
        const styleClass = {
          primary: "bg-blue-600 hover:bg-blue-700 text-white",
          secondary: "bg-gray-600 hover:bg-gray-700 text-white",
          outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
        };
        return (
          <div className="mb-4">
            <a
              href={link}
              className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${styleClass[style]}`}
            >
              {text}
            </a>
          </div>
        );
      },
    },
    ColumnsBlock: {
      fields: {
        columns: {
          type: "array",
          arrayFields: {
            content: { type: "textarea", label: "Column Content" },
          },
          label: "Columns",
          defaultItemProps: {
            content: "Column content...",
          },
        },
      },
      defaultProps: {
        columns: [
          { content: "First column content" },
          { content: "Second column content" },
        ],
      },
      render: ({ columns }) => {
        const colClass = {
          1: "w-full",
          2: "w-1/2",
          3: "w-1/3",
          4: "w-1/4",
        };
        const cols = columns.length;
        return (
          <div className="flex gap-4 mb-6 flex-wrap">
            {columns.map((col, idx) => (
              <div key={idx} className={`${colClass[Math.min(cols, 4)]} min-w-[200px]`}>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>{col.content}</p>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    QuoteBlock: {
      fields: {
        quote: { type: "textarea", label: "Quote Text" },
        author: { type: "text", label: "Author" },
      },
      defaultProps: {
        quote: "This is an inspiring quote that captures the essence of wisdom.",
        author: "John Doe",
      },
      render: ({ quote, author }) => {
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-6 italic">
            <p className="text-lg mb-2">&ldquo;{quote}&rdquo;</p>
            {author && <cite className="text-sm text-gray-600">— {author}</cite>}
          </blockquote>
        );
      },
    },
    DividerBlock: {
      fields: {
        style: {
          type: "select",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
          ],
          label: "Divider Style"
        },
      },
      defaultProps: {
        style: "solid",
      },
      render: ({ style }) => {
        const styleClass = {
          solid: "border-solid",
          dashed: "border-dashed",
          dotted: "border-dotted",
        };
        return (
          <hr className={`my-6 border-t-2 ${styleClass[style]} border-gray-300`} />
        );
      },
    },
    VideoBlock: {
      fields: {
        url: { type: "text", label: "Video URL (YouTube or other embed)" },
        aspectRatio: {
          type: "select",
          options: [
            { label: "16:9", value: "16/9" },
            { label: "4:3", value: "4/3" },
            { label: "1:1", value: "1/1" },
          ],
          label: "Aspect Ratio"
        },
      },
      defaultProps: {
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        aspectRatio: "16/9",
      },
      render: ({ url, aspectRatio }) => {
        return (
          <div className="mb-6">
            <div
              className="relative w-full rounded-lg overflow-hidden"
              style={{ paddingBottom: `calc(100% / (${aspectRatio}))` }}
            >
              <iframe
                src={url}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      },
    },

    // Import all the comprehensive components
    ...puckComponents,
  },
  categories: {
    navigation: {
      components: ['Header', 'Footer'],
    },
    introduction: {
      components: ['Hero'],
    },
    content: {
      components: ['Bento', 'ArticleCard', 'FeatureCards', 'CardGrid', 'TwoColumn', 'Articles', 'Faq', 'Cta'],
    },
    'social-proof': {
      components: ['Testimonials', 'Stats', 'Customers'],
      title: 'Social Proof',
    },
    business: {
      components: ['Pricing', 'ContactUs'],
    },
    basic: {
      components: ['HeadingBlock', 'TextBlock', 'ImageBlock', 'ButtonBlock', 'ColumnsBlock', 'QuoteBlock', 'DividerBlock', 'VideoBlock'],
      title: 'Basic Blocks',
    },
  },
};

export default function PuckEditor({ pageId, initialData }) {
  const [data, setData] = useState(initialData || { content: [], root: {} });
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isLoading, setIsLoading] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Load initial data from database if not provided or if it's empty
  useEffect(() => {
    async function loadData() {
      if (!pageId) return;

      // Skip loading if we already have valid initial data with content
      if (initialData && initialData.content && initialData.content.length > 0) {
        setData(initialData);
        return;
      }

      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: pageData, error } = await supabase
          .from('nwp_pages')
          .select('content')
          .eq('page_uid', pageId)
          .single();

        if (error) {
          console.error('Error loading page data:', error.message || error);
          // Initialize with empty data if there's an error
          setData({ content: [], root: {} });
          return;
        }

        if (pageData?.content) {
          // Parse content if it's a string, otherwise use as-is
          const parsedContent = typeof pageData.content === 'string'
            ? JSON.parse(pageData.content)
            : pageData.content;
          setData(parsedContent);
        } else {
          // Initialize with empty data if content is null
          setData({ content: [], root: {} });
        }
      } catch (err) {
        console.error('Error loading page data:', err.message || err);
        // Initialize with empty data on error
        setData({ content: [], root: {} });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [pageId]);

  // Debounced save function
  const debouncedSave = useCallback(async (data) => {
    if (!pageId) return;

    try {
      setSaveStatus('Saving...');
      const supabase = createClient();

      const { error } = await supabase
        .from('nwp_pages')
        .update({
          content: data,
          updated_at: new Date().toISOString(),
        })
        .eq('page_uid', pageId);

      if (error) {
        console.error('Error saving page data:', error);
        setSaveStatus('Error saving');
      } else {
        setSaveStatus('Saved');
      }
    } catch (err) {
      console.error('Error saving page data:', err);
      setSaveStatus('Error saving');
    }
  }, [pageId]);

  // Handle data changes with debouncing
  const handleChange = useCallback((newData) => {
    setData(newData);
    setSaveStatus('Saving...');

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save (2 seconds)
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave(newData);
    }, 2000);
  }, [debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle publish
  const handlePublish = async (data) => {
    if (!pageId) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('nwp_pages')
        .update({
          content: data,
          page_status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('page_uid', pageId);

      if (error) {
        console.error('Error publishing page:', error);
        alert('Failed to publish page');
      } else {
        alert('Page published successfully!');
      }
    } catch (err) {
      console.error('Error publishing page:', err);
      alert('Failed to publish page');
    }
  };

  return (
    <div className="w-full h-screen">
      {/* Puck Editor */}
      <Puck
        config={config}
        data={data}
        onPublish={handlePublish}
        onChange={handleChange}
        headerTitle={saveStatus}
        plugins={[
          createAiPlugin(),
        ]}
      />
    </div>
  );
}
