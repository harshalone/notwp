'use client';

import { Check, ChevronDown } from 'lucide-react';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';

const TEXT_COLORS = [
  { name: 'Default', color: '#000000' },
  { name: 'Purple', color: '#9333EA' },
  { name: 'Red', color: '#E00000' },
  { name: 'Yellow', color: '#EAB308' },
  { name: 'Blue', color: '#2563EB' },
  { name: 'Green', color: '#008A00' },
  { name: 'Orange', color: '#FFA500' },
  { name: 'Pink', color: '#BA4081' },
  { name: 'Gray', color: '#A8A29E' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Default', color: 'transparent' },
  { name: 'Purple', color: '#f3e8ff' },
  { name: 'Red', color: '#fee2e2' },
  { name: 'Yellow', color: '#fef9c3' },
  { name: 'Blue', color: '#dbeafe' },
  { name: 'Green', color: '#dcfce7' },
  { name: 'Orange', color: '#ffedd5' },
  { name: 'Pink', color: '#fce7f3' },
  { name: 'Gray', color: '#f5f5f4' },
];

export const ColorSelector = ({ editor, open, onOpenChange }) => {
  if (!editor) return null;

  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive('textStyle', { color })
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive('highlight', { color })
  );

  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-2 rounded-none border-none px-3 py-2 text-sm hover:bg-stone-100 transition-colors"
      >
        <span
          className="rounded-sm px-1 font-semibold"
          style={{
            color: activeColorItem?.color,
            backgroundColor: activeHighlightItem?.color,
          }}
        >
          A
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => onOpenChange(false)}
          />
          <div className="absolute right-0 top-full z-[10000] mt-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded-lg border border-stone-200 bg-white p-1 shadow-xl">
            <div className="flex flex-col">
              <div className="my-1 px-2 text-sm font-semibold text-stone-500">Color</div>
              {TEXT_COLORS.map(({ name, color }) => (
                <button
                  key={name}
                  onClick={() => {
                    if (name === 'Default') {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color).run();
                    }
                    onOpenChange(false);
                  }}
                  className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm hover:bg-stone-100 transition-colors rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-sm border border-stone-200 px-2 py-px font-medium"
                      style={{ color }}
                    >
                      A
                    </div>
                    <span>{name}</span>
                  </div>
                  {editor.isActive('textStyle', { color }) && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
            <div>
              <div className="my-1 px-2 text-sm font-semibold text-stone-500">
                Background
              </div>
              {HIGHLIGHT_COLORS.map(({ name, color }) => (
                <button
                  key={name}
                  onClick={() => {
                    if (name === 'Default') {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor.chain().focus().setHighlight({ color }).run();
                    }
                    onOpenChange(false);
                  }}
                  className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm hover:bg-stone-100 transition-colors rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-sm border border-stone-200 px-2 py-px font-medium"
                      style={{ backgroundColor: color }}
                    >
                      A
                    </div>
                    <span>{name}</span>
                  </div>
                  {editor.isActive('highlight', { color }) && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Export the extensions needed for color support
export const ColorExtensions = [TextStyle, Color, Highlight.configure({ multicolor: true })];
