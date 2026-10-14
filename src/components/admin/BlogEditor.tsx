import React, { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link2,
  Pilcrow,
} from 'lucide-react';
import { looksLikeHtml, plainTextToBlogHtml } from '../../lib/blogContent';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function toEditorHtml(value: string): string {
  if (!value) return '<p><br></p>';
  return looksLikeHtml(value) ? value : plainTextToBlogHtml(value);
}

export const BlogEditor: React.FC<Props> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedHtml = useRef('');
  const ready = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (!ready.current || value !== savedHtml.current) {
      editor.innerHTML = toEditorHtml(value);
      savedHtml.current = value;
      ready.current = true;
    }
  }, [value]);

  const sync = () => {
    const html = editorRef.current?.innerHTML || '';
    savedHtml.current = html;
    onChange(html);
  };

  const format = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    sync();
  };

  const addLink = () => {
    const url = window.prompt('Link address', 'https://');
    if (!url) return;
    format('createLink', url);
  };

  const tools = [
    { label: 'Bold', icon: Bold, run: () => format('bold') },
    { label: 'Italic', icon: Italic, run: () => format('italic') },
    { label: 'Underline', icon: Underline, run: () => format('underline') },
    { label: 'Heading', icon: Heading2, run: () => format('formatBlock', 'H2') },
    { label: 'Paragraph', icon: Pilcrow, run: () => format('formatBlock', 'P') },
    { label: 'Bullet list', icon: List, run: () => format('insertUnorderedList') },
    { label: 'Numbered list', icon: ListOrdered, run: () => format('insertOrderedList') },
    { label: 'Quote', icon: Quote, run: () => format('formatBlock', 'BLOCKQUOTE') },
    { label: 'Link', icon: Link2, run: addLink },
  ];

  return (
    <div className="rounded-xl border border-gray-300 overflow-hidden bg-white shadow-2xs">
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              aria-label={tool.label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={tool.run}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[11px] font-bold text-gray-800 hover:border-[#0B1F3A] hover:text-[#0B1F3A] cursor-pointer"
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Article content"
        onInput={sync}
        suppressContentEditableWarning
        className="min-h-56 max-h-[420px] overflow-y-auto px-4 py-3 text-sm leading-relaxed text-[#0B1F3A] focus:outline-none [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-['Barlow',sans-serif] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0B1F3A] [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:underline"
      />
    </div>
  );
};
