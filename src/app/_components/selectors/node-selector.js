'use client';

import { useState } from 'react';
import {
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  TextQuote,
  ListOrdered,
  TextIcon,
  Code,
  CheckSquare,
  List,
} from 'lucide-react';

export const NodeSelector = ({ editor, open, onOpenChange }) => {
  if (!editor) return null;

  const items = [
    {
      name: 'Text',
      icon: TextIcon,
      command: () => editor.chain().focus().clearNodes().run(),
      isActive: () =>
        editor.isActive('paragraph') &&
        !editor.isActive('bulletList') &&
        !editor.isActive('orderedList'),
    },
    {
      name: 'Heading 1',
      icon: Heading1,
      command: () => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      name: 'Heading 2',
      icon: Heading2,
      command: () => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      name: 'Heading 3',
      icon: Heading3,
      command: () => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    {
      name: 'To-do List',
      icon: CheckSquare,
      command: () => editor.chain().focus().clearNodes().toggleTaskList().run(),
      isActive: () => editor.isActive('taskItem'),
    },
    {
      name: 'Bullet List',
      icon: List,
      command: () => editor.chain().focus().clearNodes().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      name: 'Numbered List',
      icon: ListOrdered,
      command: () => editor.chain().focus().clearNodes().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      name: 'Quote',
      icon: TextQuote,
      command: () => editor.chain().focus().clearNodes().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      name: 'Code',
      icon: Code,
      command: () => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
  ];

  const activeItem = items.find((item) => item.isActive()) || { name: 'Multiple' };

  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-1 rounded-none border-none px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 transition-colors"
      >
        <span className="whitespace-nowrap">{activeItem.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => onOpenChange(false)}
          />
          <div className="absolute left-0 top-full z-[10000] mt-1 w-48 rounded-lg border border-stone-200 bg-white p-1 shadow-xl">
            {items.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.command();
                  onOpenChange(false);
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div className="rounded-sm border border-stone-200 p-1">
                    <item.icon className="h-3 w-3" />
                  </div>
                  <span>{item.name}</span>
                </div>
                {activeItem.name === item.name && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
