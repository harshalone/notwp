import { Render } from "@measured/puck";
import "@measured/puck/puck.css";
import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { puckComponents } from '@/app/_components/puck/puck-components';

// Enable dynamic params for this route
export const dynamic = 'force-dynamic';

// Define the same config as in PuckEditor but for server-side rendering
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
            {author && <cite className="text-sm text-gray-600"> {author}</cite>}
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
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      },
    },
    ContainerBlock: {
      fields: {
        maxWidth: {
          type: "select",
          options: [
            { label: "Small (640px)", value: "max-w-sm" },
            { label: "Medium (768px)", value: "max-w-md" },
            { label: "Large (1024px)", value: "max-w-lg" },
            { label: "Extra Large (1280px)", value: "max-w-xl" },
            { label: "2XL (1536px)", value: "max-w-2xl" },
            { label: "Full Width", value: "max-w-full" },
          ],
          label: "Max Width"
        },
        padding: {
          type: "select",
          options: [
            { label: "None", value: "p-0" },
            { label: "Small", value: "p-4" },
            { label: "Medium", value: "p-6" },
            { label: "Large", value: "p-8" },
            { label: "Extra Large", value: "p-12" },
          ],
          label: "Padding"
        },
        backgroundColor: {
          type: "select",
          options: [
            { label: "Transparent", value: "bg-transparent" },
            { label: "White", value: "bg-white" },
            { label: "Gray 50", value: "bg-gray-50" },
            { label: "Gray 100", value: "bg-gray-100" },
            { label: "Blue 50", value: "bg-blue-50" },
            { label: "Blue 100", value: "bg-blue-100" },
          ],
          label: "Background Color"
        },
        centered: {
          type: "select",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
          label: "Center Container"
        },
      },
      defaultProps: {
        maxWidth: "max-w-xl",
        padding: "p-6",
        backgroundColor: "bg-transparent",
        centered: true,
      },
      render: ({ maxWidth, padding, backgroundColor, centered, puck: { renderDropZone } }) => {
        return (
          <div className={`${maxWidth} ${padding} ${backgroundColor} ${centered ? 'mx-auto' : ''} mb-6`}>
            {renderDropZone("container-content")}
          </div>
        );
      },
    },
    FlexboxBlock: {
      fields: {
        direction: {
          type: "select",
          options: [
            { label: "Row", value: "flex-row" },
            { label: "Column", value: "flex-col" },
            { label: "Row Reverse", value: "flex-row-reverse" },
            { label: "Column Reverse", value: "flex-col-reverse" },
          ],
          label: "Flex Direction"
        },
        justifyContent: {
          type: "select",
          options: [
            { label: "Start", value: "justify-start" },
            { label: "Center", value: "justify-center" },
            { label: "End", value: "justify-end" },
            { label: "Space Between", value: "justify-between" },
            { label: "Space Around", value: "justify-around" },
            { label: "Space Evenly", value: "justify-evenly" },
          ],
          label: "Justify Content"
        },
        alignItems: {
          type: "select",
          options: [
            { label: "Start", value: "items-start" },
            { label: "Center", value: "items-center" },
            { label: "End", value: "items-end" },
            { label: "Stretch", value: "items-stretch" },
            { label: "Baseline", value: "items-baseline" },
          ],
          label: "Align Items"
        },
        gap: {
          type: "select",
          options: [
            { label: "None", value: "gap-0" },
            { label: "Small (1rem)", value: "gap-4" },
            { label: "Medium (1.5rem)", value: "gap-6" },
            { label: "Large (2rem)", value: "gap-8" },
            { label: "Extra Large (3rem)", value: "gap-12" },
          ],
          label: "Gap"
        },
        wrap: {
          type: "select",
          options: [
            { label: "No Wrap", value: "flex-nowrap" },
            { label: "Wrap", value: "flex-wrap" },
            { label: "Wrap Reverse", value: "flex-wrap-reverse" },
          ],
          label: "Flex Wrap"
        },
        columns: {
          type: "select",
          options: [
            { label: "1 Column", value: 1 },
            { label: "2 Columns", value: 2 },
            { label: "3 Columns", value: 3 },
            { label: "4 Columns", value: 4 },
          ],
          label: "Number of Columns"
        },
      },
      defaultProps: {
        direction: "flex-row",
        justifyContent: "justify-start",
        alignItems: "items-stretch",
        gap: "gap-4",
        wrap: "flex-wrap",
        columns: 2,
      },
      render: ({ direction, justifyContent, alignItems, gap, wrap, columns, puck: { renderDropZone } }) => {
        return (
          <div className={`flex ${direction} ${justifyContent} ${alignItems} ${gap} ${wrap} mb-6`}>
            {Array.from({ length: columns }).map((_, idx) => (
              <div key={idx} className="flex-1 min-w-[200px]">
                {renderDropZone(`flexbox-col-${idx}`)}
              </div>
            ))}
          </div>
        );
      },
    },

    // Import all the comprehensive components
    ...puckComponents,
  },
};

export default async function PublicPage({ params }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // Create regular Supabase client (respects RLS policies)
  const supabase = await createClient();

  // Fetch only published pages using the public policy
  const { data: pageData, error } = await supabase
    .from('nwp_pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_status', 'published')
    .single();

  if (error || !pageData) {
    notFound();
  }

  // Parse the content data
  let data = { content: [], root: {} };
  if (pageData.content) {
    data = typeof pageData.content === 'string'
      ? JSON.parse(pageData.content)
      : pageData.content;
  }

  return (
    <div className="min-h-screen bg-white">
      <Render config={config} data={data} />
    </div>
  );
}
