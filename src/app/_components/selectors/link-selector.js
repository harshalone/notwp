'use client';

import { useEffect, useRef } from 'react';
import { Check, Trash } from 'lucide-react';

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function getUrlFromString(str) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    return null;
  }
}

export const LinkSelector = ({ editor, open, onOpenChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!editor) return null;

  const isActive = editor.isActive('link');

  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-2 rounded-none border-none px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 transition-colors"
      >
        <span className="text-base">↗</span>
        <span
          className={`underline decoration-stone-400 underline-offset-4 ${
            isActive ? 'text-blue-500' : ''
          }`}
        >
          Link
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[9999]"
            onClick={() => onOpenChange(false)}
          />
          <div className="absolute left-0 top-full z-[10000] mt-1 w-60 rounded-lg border border-stone-200 bg-white p-1 shadow-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget[0];
                const url = getUrlFromString(input.value);
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                  onOpenChange(false);
                }
              }}
              className="flex gap-1"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Paste a link"
                className="flex-1 bg-white p-2 text-sm outline-none rounded"
                defaultValue={editor.getAttributes('link').href || ''}
              />
              {editor.getAttributes('link').href ? (
                <button
                  type="button"
                  className="flex h-8 items-center rounded-sm p-2 text-red-600 transition-all hover:bg-red-100"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    if (inputRef.current) inputRef.current.value = '';
                    onOpenChange(false);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" className="flex h-8 items-center rounded-sm bg-stone-900 px-2 text-white hover:bg-stone-800">
                  <Check className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
};
