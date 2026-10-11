'use client';

import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const lines = content.split('\n');

  const renderInline = (text: string): React.ReactNode[] => {
    // Matches **bold**, `code`, and [link](url)
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-[var(--ink)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="rounded border border-[var(--line)] bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--brand)] font-medium"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const title = part.slice(1, part.indexOf(']('));
        const url = part.slice(part.indexOf('](') + 2, -1);
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--cyan)] underline hover:text-[var(--brand)] transition-colors"
          >
            {title}
          </a>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="max-h-[160px] overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-3.5 space-y-2 text-xs leading-relaxed text-[var(--ink-2)] scrollbar-thin">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="mt-2.5 first:mt-0 mb-1 text-[13px] font-bold text-[var(--ink)] flex items-center gap-1.5"
            >
              {renderInline(trimmed.slice(4))}
            </h4>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="mt-3 first:mt-0 mb-1.5 text-[14px] font-bold text-[var(--ink)]"
            >
              {renderInline(trimmed.slice(3))}
            </h3>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h2
              key={idx}
              className="mt-3.5 first:mt-0 mb-2 text-[15px] font-extrabold text-[var(--ink)]"
            >
              {renderInline(trimmed.slice(2))}
            </h2>
          );
        }

        if (trimmed === '---') {
          return <hr key={idx} className="my-2 border-[var(--line)]" />;
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const isIndented = line.startsWith('  ') || line.startsWith('\t');
          return (
            <div
              key={idx}
              className={`flex items-start gap-2 ${isIndented ? 'pl-4' : 'pl-1'}`}
            >
              <span
                className={`mt-1.5 rounded-full shrink-0 ${
                  isIndented
                    ? 'h-1 w-1 bg-[var(--muted)] opacity-80'
                    : 'h-1.5 w-1.5 bg-[var(--brand)]'
                }`}
              />
              <div className="flex-1 text-[12px] text-[var(--muted)] leading-relaxed">
                {renderInline(trimmed.slice(2))}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="text-[12px] text-[var(--muted)] leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default MarkdownViewer;
