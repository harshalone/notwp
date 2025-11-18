'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorCommandItem,
  EditorBubble,
  EditorBubbleItem,
  ImageResizer,
  StarterKit,
  Placeholder,
  TiptapLink,
  TiptapImage,
  TiptapUnderline,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  Twitter,
  Youtube,
  GlobalDragHandle,
  createSuggestionItems,
  Command,
  renderItems,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  useEditor,
} from 'novel';
import { createClient } from '@/lib/supabase-browser';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Youtube as YoutubeIcon,
  Twitter as TwitterIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code as CodeIcon,
} from 'lucide-react';
import { ImageModal, YoutubeModal, TwitterModal } from './MediaModal';
import { NodeSelector } from './selectors/node-selector';
import { LinkSelector } from './selectors/link-selector';
import { ColorSelector, ColorExtensions } from './selectors/color-selector';

const defaultContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Why We Built Not WordPress: Rethinking Content Publishing for the Modern Web' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'After years of watching creators struggle with bloated CMS platforms, we decided it was time for something different. Not WordPress represents a fundamental shift in how we think about content creation - combining the simplicity writers crave with the power developers need.',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
        alt: 'Modern workspace with laptop',
        title: 'Modern content creation workspace',
      },
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'The Problem with Traditional CMSs' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'WordPress powers over 40% of the web, but that dominance comes with a cost. Every year, sites become slower, more vulnerable, and harder to maintain. The plugin ecosystem that made WordPress popular has become its Achilles heel - a tangled web of dependencies that breaks with every update.',
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'We spent more time maintaining our WordPress site than actually creating content. That\'s when we knew something had to change.',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The issues are well-documented:',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Performance bottlenecks',
                },
                {
                  type: 'text',
                  text: ' from database queries and legacy architecture',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Security vulnerabilities',
                },
                {
                  type: 'text',
                  text: ' in plugins and themes that expose millions of sites',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Developer friction',
                },
                {
                  type: 'text',
                  text: ' from outdated tooling and PHP-based workflows',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Content lock-in',
                },
                {
                  type: 'text',
                  text: ' that makes migration painful and expensive',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'A New Approach to Content Creation' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Not WordPress takes inspiration from the best modern writing tools - Notion, Medium, and Substack - while maintaining the flexibility and control that developers expect from a professional CMS.',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        alt: 'Analytics and data visualization',
        title: 'Built for performance and insights',
      },
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Key Features That Set Us Apart' }],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'AI-Powered Editor',
                },
                {
                  type: 'text',
                  text: ' — Write faster with intelligent autocomplete and suggestions',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Lightning-Fast Performance',
                },
                {
                  type: 'text',
                  text: ' — Built on Next.js and React for instant page loads',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Modern Tech Stack',
                },
                {
                  type: 'text',
                  text: ' — TypeScript, Tailwind CSS, and cutting-edge web standards',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Markdown-First',
                },
                {
                  type: 'text',
                  text: ' — Your content is portable and never locked in',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The editor itself is a joy to use. Inspired by Notion\'s slash commands and Medium\'s distraction-free interface, writing in Not WordPress feels natural and intuitive. Type ',
        },
        {
          type: 'text',
          marks: [{ type: 'code' }],
          text: '/',
        },
        {
          type: 'text',
          text: ' to bring up the command menu, select text to format it, or just start typing and let the AI help you along the way.',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
        alt: 'Developer coding on laptop',
        title: 'Built by developers, for developers',
      },
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Performance That Matters' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'We obsess over performance because we know it matters. Every millisecond of load time affects your conversion rate, SEO rankings, and user experience. That\'s why Not WordPress is built on modern web frameworks that deliver:',
        },
      ],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Sub-second page loads with static site generation',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Automatic image optimization and lazy loading',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Edge caching and CDN distribution out of the box',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Real-time collaboration (coming soon)',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'The Future of Publishing' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'We believe the future of web publishing is fast, secure, and developer-friendly. Not WordPress isn\'t just another CMS - it\'s a complete rethinking of how content platforms should work in 2024 and beyond.',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
        alt: 'Team collaboration',
        title: 'Building the future together',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Whether you\'re a solo blogger, a growing startup, or an enterprise publisher, Not WordPress scales with you. Start simple, grow sophisticated, and never worry about your CMS holding you back.',
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              marks: [{ type: 'italic' }],
              text: 'Ready to experience the difference? Start writing with Not WordPress today and join the movement toward better content publishing.',
            },
          ],
        },
      ],
    },
    {
      type: 'horizontalRule',
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'Want to learn more?',
        },
        {
          type: 'text',
          text: ' Check out our ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: '#',
                target: '_blank',
                class: 'text-blue-500 underline',
              },
            },
          ],
          text: 'documentation',
        },
        {
          type: 'text',
          text: ' or ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: '#',
                target: '_blank',
                class: 'text-blue-500 underline',
              },
            },
          ],
          text: 'get started with our quick-start guide',
        },
        {
          type: 'text',
          text: '.',
        },
      ],
    },
  ],
};

// Simple image upload handler (placeholder - you can implement actual upload)
const uploadFn = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const createSuggestionItemsWithModals = (modalHandlers) => createSuggestionItems([
  {
    title: 'Text',
    description: 'Just start typing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: <Type className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'big', 'large', 'h1'],
    icon: <Heading1 className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'medium', 'h2'],
    icon: <Heading2 className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['subtitle', 'small', 'h3'],
    icon: <Heading3 className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: <CheckSquare className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['unordered', 'point'],
    icon: <List className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['ordered', 'number'],
    icon: <ListOrdered className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    searchTerms: ['blockquote', 'citation'],
    icon: <Quote className="w-5 h-5" />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    searchTerms: ['codeblock', 'programming'],
    icon: <Code className="w-5 h-5" />,
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Image',
    description: 'Upload an image from your computer.',
    searchTerms: ['photo', 'picture', 'media'],
    icon: <ImageIcon className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      modalHandlers.openImageModal(editor);
    },
  },
  {
    title: 'Youtube',
    description: 'Embed a Youtube video.',
    searchTerms: ['video', 'youtube', 'embed'],
    icon: <YoutubeIcon className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      modalHandlers.openYoutubeModal(editor);
    },
  },
  {
    title: 'Twitter',
    description: 'Embed a Tweet.',
    searchTerms: ['twitter', 'x', 'embed', 'social'],
    icon: <TwitterIcon className="w-5 h-5" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      modalHandlers.openTwitterModal(editor);
    },
  },
]);

const BubbleContent = ({ openNode, setOpenNode, openLink, setOpenLink, openColor, setOpenColor }) => {
  const { editor } = useEditor();

  if (!editor) return null;

  return (
    <>
      <NodeSelector
        editor={editor}
        open={openNode}
        onOpenChange={setOpenNode}
      />

      <div className="h-6 w-px bg-stone-200" />

      <LinkSelector
        editor={editor}
        open={openLink}
        onOpenChange={setOpenLink}
      />

      <div className="h-6 w-px bg-stone-200" />

      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleBold().run()}
        className="px-3 py-2 text-sm hover:bg-stone-100 transition-colors"
      >
        <Bold className={`h-4 w-4 ${editor.isActive('bold') ? 'text-blue-500' : 'text-stone-700'}`} />
      </EditorBubbleItem>

      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
        className="px-3 py-2 text-sm hover:bg-stone-100 transition-colors"
      >
        <Italic className={`h-4 w-4 ${editor.isActive('italic') ? 'text-blue-500' : 'text-stone-700'}`} />
      </EditorBubbleItem>

      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}
        className="px-3 py-2 text-sm hover:bg-stone-100 transition-colors"
      >
        <Underline className={`h-4 w-4 ${editor.isActive('underline') ? 'text-blue-500' : 'text-stone-700'}`} />
      </EditorBubbleItem>

      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
        className="px-3 py-2 text-sm hover:bg-stone-100 transition-colors"
      >
        <Strikethrough className={`h-4 w-4 ${editor.isActive('strike') ? 'text-blue-500' : 'text-stone-700'}`} />
      </EditorBubbleItem>

      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleCode().run()}
        className="px-3 py-2 text-sm hover:bg-stone-100 transition-colors"
      >
        <CodeIcon className={`h-4 w-4 ${editor.isActive('code') ? 'text-blue-500' : 'text-stone-700'}`} />
      </EditorBubbleItem>

      <div className="h-6 w-px bg-stone-200" />

      <ColorSelector
        editor={editor}
        open={openColor}
        onOpenChange={setOpenColor}
      />
    </>
  );
};

export default function Editor({ postId, initialContent: initialContentProp }) {
  const [initialContent, setInitialContent] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [twitterModalOpen, setTwitterModalOpen] = useState(false);
  const [currentEditor, setCurrentEditor] = useState(null);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  // Debounce timer ref
  const saveTimeoutRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Use provided initialContent or fall back to default
    setInitialContent(initialContentProp || defaultContent);
  }, [initialContentProp]);

  // Debounced save function
  const debouncedSave = useCallback(async (content) => {
    if (!postId) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('nwp_posts')
        .update({
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq('post_uid', postId);

      if (error) {
        console.error('Error saving content:', error);
        setSaveStatus('Error saving');
      } else {
        setSaveStatus('Saved');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      setSaveStatus('Error saving');
    }
  }, [postId]);

  // Handle editor updates with debouncing
  const handleEditorUpdate = useCallback(({ editor }) => {
    setSaveStatus('Saving...');

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Get the JSON content from the editor
    const content = editor.getJSON();

    // Set new timeout for debounced save (2 seconds)
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave(content);
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

  const modalHandlers = {
    openImageModal: (editor) => {
      setCurrentEditor(editor);
      setImageModalOpen(true);
    },
    openYoutubeModal: (editor) => {
      setCurrentEditor(editor);
      setYoutubeModalOpen(true);
    },
    openTwitterModal: (editor) => {
      setCurrentEditor(editor);
      setTwitterModalOpen(true);
    },
  };

  const handleImageInsert = (url) => {
    if (currentEditor && url) {
      currentEditor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleYoutubeInsert = (url) => {
    if (currentEditor && url) {
      currentEditor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const handleTwitterInsert = (url) => {
    if (currentEditor && url) {
      currentEditor.chain().focus().setTweet({ src: url }).run();
    }
  };

  const suggestionItems = createSuggestionItemsWithModals(modalHandlers);

  const slashCommand = Command.configure({
    suggestion: {
      items: () => suggestionItems,
      render: renderItems,
    },
  });

  const extensions = [
    StarterKit.configure({
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc list-outside leading-3',
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: 'list-decimal list-outside leading-3',
        },
      },
      listItem: {
        HTMLAttributes: {
          class: 'leading-normal',
        },
      },
      blockquote: {
        HTMLAttributes: {
          class: 'border-l-4 border-stone-300 pl-4',
        },
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'rounded-md bg-stone-950 p-5 font-mono text-sm text-stone-50',
        },
      },
      code: {
        HTMLAttributes: {
          class: 'rounded-md bg-stone-200 px-1.5 py-1 font-mono text-sm text-stone-900',
          spellcheck: 'false',
        },
      },
      horizontalRule: false,
      dropcursor: {
        color: '#60a5fa',
        width: 4,
      },
      gapcursor: false,
    }),
    HorizontalRule.configure({
      HTMLAttributes: {
        class: 'mt-4 mb-6 border-t border-stone-300',
      },
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        class:
          'text-blue-500 underline underline-offset-[3px] hover:text-blue-600 transition-colors cursor-pointer',
      },
      openOnClick: false,
    }),
    UpdatedImage.configure({
      HTMLAttributes: {
        class: 'rounded-lg border border-stone-200',
      },
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return `Heading ${node.attrs.level}`;
        }
        return "Press '/' for commands, or start typing...";
      },
      includeChildren: true,
    }),
    slashCommand,
    TaskList.configure({
      HTMLAttributes: {
        class: 'not-prose pl-0 list-none',
      },
    }),
    TaskItem.configure({
      HTMLAttributes: {
        class: 'flex items-start gap-2 my-2',
      },
      nested: true,
    }),
    TiptapUnderline,
    GlobalDragHandle.configure({
      dragHandleWidth: 20,
    }),
    Twitter,
    Youtube.configure({
      HTMLAttributes: {
        class: 'rounded-lg overflow-hidden',
      },
    }),
    ...ColorExtensions,
  ];

  if (!initialContent) return null;

  return (
    <>
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onInsert={handleImageInsert}
      />
      <YoutubeModal
        isOpen={youtubeModalOpen}
        onClose={() => setYoutubeModalOpen(false)}
        onInsert={handleYoutubeInsert}
      />
      <TwitterModal
        isOpen={twitterModalOpen}
        onClose={() => setTwitterModalOpen(false)}
        onInsert={handleTwitterInsert}
      />
      <div className="relative w-full">
      <div className="absolute right-5 top-5 z-10 mb-5 flex gap-2">
        <div className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
          {saveStatus}
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-screen w-full border-stone-200 bg-white rounded-lg border shadow-sm overflow-visible"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                'focus:outline-none max-w-full pl-12 pr-8 py-12',
            },
          }}
          onUpdate={handleEditorUpdate}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-xl border border-stone-200 bg-white px-1 py-2 shadow-xl transition-all">
            <EditorCommandEmpty className="px-2 py-2 text-center text-sm text-stone-500">
              No results found
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-stone-50 aria-selected:bg-stone-100 cursor-pointer transition-colors"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{item.title}</p>
                    <p className="text-xs text-stone-500">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: 'top',
            }}
            className="flex w-fit max-w-[90vw] overflow-visible rounded-lg border border-stone-200 bg-white shadow-xl"
          >
            <BubbleContent
              openNode={openNode}
              setOpenNode={setOpenNode}
              openLink={openLink}
              setOpenLink={setOpenLink}
              openColor={openColor}
              setOpenColor={setOpenColor}
            />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
    </>
  );
}
