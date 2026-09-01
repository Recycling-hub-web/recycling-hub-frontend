'use client';

// NOTE: requires @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link,
// and @tiptap/extension-heading — none of which are installed in this
// project yet (`npm ls @tiptap/react` → not found). This file will not
// compile until those are added. Left in place (fully ported/fixed) rather
// than silently dropped, since it's a real, useful primitive — flagging
// the dependency decision back rather than installing packages unasked.
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Check,
  Heading1,
  Heading2,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Pilcrow,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getNestedValue } from '../utils';

type RichTextEditorProps = {
  label: string;
  field: string;
  required?: boolean;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
};

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`flex size-7 items-center justify-center rounded transition ${
      active
        ? 'bg-brand-100 text-brand-700'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({
  label,
  field,
  required = false,
  formData,
  errors,
  updateFormData,
}: RichTextEditorProps) => {
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';
  const error = errors?.[field];

  const [linkPopover, setLinkPopover] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const linkLabelRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2] }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'outline-none min-h-[120px] px-3 py-2 text-sm text-slate-800 prose prose-sm max-w-none',
      },
    },
    onUpdate({ editor: e }) {
      const html = e.getHTML();
      updateFormData(field, html === '<p></p>' ? '' : html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value === '' && editor.getHTML() !== '<p></p>') {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  const openLinkPopover = useCallback(() => {
    if (!editor) return;
    const existing = editor.getAttributes('link').href ?? '';
    const selection = editor.state.doc.cut(
      editor.state.selection.from,
      editor.state.selection.to,
    ).textContent;
    setLinkUrl(existing);
    setLinkLabel(selection || '');
    setLinkPopover(true);
    setTimeout(() => linkLabelRef.current?.focus(), 50);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const chain = editor.chain().focus().extendMarkRange('link');
      if (linkLabel.trim()) {
        chain.insertContent(`<a href="${url}">${linkLabel.trim()}</a>`).run();
      } else {
        chain.setLink({ href: url }).run();
      }
    }
    setLinkPopover(false);
    setLinkLabel('');
    setLinkUrl('');
  }, [editor, linkUrl, linkLabel]);

  const cancelLink = () => {
    setLinkPopover(false);
    setLinkLabel('');
    setLinkUrl('');
  };

  return (
    <div className="mb-4" data-field={field}>
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div
        className={`mt-2 overflow-hidden rounded-xl border transition-colors focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 ${
          error ? 'border-red-500' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor?.chain().focus().setParagraph().run()}
            active={editor?.isActive('paragraph')}
            title="Paragraph"
          >
            <Pilcrow className="size-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor?.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="size-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor?.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="size-3.5" />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-slate-200" />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive('bold')}
            title="Bold"
          >
            <Bold className="size-3.5" />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-slate-200" />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive('bulletList')}
            title="Bullet list"
          >
            <List className="size-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive('orderedList')}
            title="Numbered list"
          >
            <ListOrdered className="size-3.5" />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-slate-200" />

          <ToolbarButton
            onClick={openLinkPopover}
            active={editor?.isActive('link')}
            title="Add link"
          >
            <Link2 className="size-3.5" />
          </ToolbarButton>

          {editor?.isActive('link') && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove link"
            >
              <Link2Off className="size-3.5" />
            </ToolbarButton>
          )}
        </div>

        {linkPopover && (
          <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 flex-col gap-1.5 sm:flex-row">
                <input
                  ref={linkLabelRef}
                  type="text"
                  placeholder="Label (optional)"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  className="h-8 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:w-40"
                />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyLink();
                    if (e.key === 'Escape') cancelLink();
                  }}
                  className="h-8 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <button
                type="button"
                onClick={applyLink}
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white transition hover:bg-brand-700"
              >
                <Check className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={cancelLink}
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        <EditorContent editor={editor} />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export { RichTextEditor };
