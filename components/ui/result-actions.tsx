'use client';

import { useState } from 'react';
import { Copy, Check, Printer, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import { domToCanvas } from 'modern-screenshot';
import { useI18n } from '@/components/i18n-provider';

interface ResultActionsProps {
  summaryText: string;
  csvData?: Record<string, string | number>[];
  csvFileName?: string;
  imageFileName?: string;
  targetId?: string;
  className?: string;
}

/** Returns a compact timestamp string like "20261015_205301" */
function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  );
}

/** Injects timestamp before the .ext of a filename, e.g. "report.png" → "report_20261015_205301.png" */
function withTimestamp(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  if (dot === -1) return `${fileName}_${getTimestamp()}`;
  return `${fileName.slice(0, dot)}_${getTimestamp()}${fileName.slice(dot)}`;
}

export function ResultActions({
  summaryText,
  csvData,
  csvFileName = 'hisobot.csv',
  imageFileName = 'sonli-usullar-hisobot.png',
  targetId,
  className = '',
}: ResultActionsProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = summaryText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!csvData || csvData.length === 0) return;
    const headers = Object.keys(csvData[0]);
    const csvRows: string[] = [];
    csvRows.push(headers.join(','));

    for (const row of csvData) {
      const values = headers.map((header) => {
        const val = row[header];
        const str = val === undefined || val === null ? '' : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', csvFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPng = async () => {
    if (isExportingPng) return;
    setIsExportingPng(true);

    try {
      // Find capture target: specific ID, or <main>, or document.body
      let targetNode: HTMLElement | null = null;
      if (targetId) {
        targetNode = document.getElementById(targetId);
      }
      if (!targetNode) {
        targetNode = document.querySelector('main');
      }
      if (!targetNode) {
        targetNode = document.body;
      }

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const bgColor = isDark ? '#0a0b0d' : '#eceef0';

      // modern-screenshot correctly resolves CSS custom properties and computed
      // styles, which fixes the "black SVG graph" bug caused by html-to-image
      // failing to inline Tailwind CSS variable-based colours.
      const canvas = await domToCanvas(targetNode, {
        backgroundColor: bgColor,
        scale: 2, // High DPI for crisp math and formulas
        filter: (node) => {
          if (node instanceof HTMLElement) {
            // Exclude toolbars and print-hidden elements from the screenshot
            if (node.classList.contains('no-export')) return false;
            if (node.classList.contains('no-print')) return false;
          }
          return true;
        },
      });

      // Draw modern watermark badge onto canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        const padding = 28;
        const brandText = 'sonli-usullar.uz';
        const subText = 'Numeric Methods';

        ctx.font = 'bold 20px "JetBrains Mono", ui-monospace, monospace';
        const brandMetrics = ctx.measureText(brandText);

        const pillWidth = Math.max(brandMetrics.width + 36, 210);
        const pillHeight = 50;
        const pillX = canvas.width - pillWidth - padding;
        const pillY = canvas.height - pillHeight - padding;
        const radius = 10;

        // Pill background with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = isDark ? '#14161a' : '#ffffff';

        ctx.beginPath();
        ctx.moveTo(pillX + radius, pillY);
        ctx.lineTo(pillX + pillWidth - radius, pillY);
        ctx.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + radius);
        ctx.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
        ctx.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - radius, pillY + pillHeight);
        ctx.lineTo(pillX + radius, pillY + pillHeight);
        ctx.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - radius);
        ctx.lineTo(pillX, pillY + radius);
        ctx.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
        ctx.closePath();
        ctx.fill();

        // Border around pill
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = isDark ? 'rgba(255, 106, 43, 0.45)' : 'rgba(232, 72, 12, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Brand Text
        ctx.fillStyle = isDark ? '#ff6a2b' : '#e8480c';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(brandText, pillX + pillWidth - 18, pillY + 22);

        // Subtitle text
        ctx.font = '600 11px sans-serif';
        ctx.fillStyle = isDark ? '#8d949d' : '#5d646e';
        ctx.fillText(subText, pillX + pillWidth - 18, pillY + 39);

        ctx.restore();
      }

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      // Add timestamp so repeated downloads don't overwrite each other
      link.download = withTimestamp(imageFileName);
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PNG export failed:', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div
      className={`no-print no-export flex flex-wrap items-center justify-between gap-3 p-3 bg-panel border border-line rounded-xl shadow-xs ${className}`}
      role="toolbar"
      aria-label={t('actions.toolbar_label')}
    >
      {/* Left side: Badge & Info */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft border border-brand/20 px-2 py-0.5 rounded">
          {t('actions.tools_badge') || 'EXPORT / TOOLS'}
        </span>
        <span className="text-xs font-semibold text-muted max-sm:hidden">
          {t('actions.tools_title') || 'Natijani saqlash va ulashish'}
        </span>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Copy Result */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-bg-2 border-line text-ink hover:border-brand hover:text-brand'
          }`}
          title={t('actions.copy_tooltip')}
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          <span>{copied ? t('actions.copied') : t('actions.copy')}</span>
        </button>

        {/* PNG Export with Watermark */}
        <button
          type="button"
          onClick={handleExportPng}
          disabled={isExportingPng}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-brand/40 bg-brand-soft text-brand hover:bg-brand hover:text-white hover:border-brand transition-all cursor-pointer disabled:opacity-60"
          title={t('actions.export_png_tooltip')}
        >
          {isExportingPng ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          <span>{isExportingPng ? t('actions.exporting_png') : t('actions.export_png')}</span>
        </button>

        {/* CSV Export */}
        {csvData && csvData.length > 0 && (
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-line bg-bg-2 text-ink hover:border-cyan hover:text-cyan transition-all cursor-pointer"
            title={t('actions.export_csv_tooltip')}
          >
            <FileSpreadsheet size={14} />
            <span>{t('actions.export_csv')}</span>
          </button>
        )}

        {/* Print / PDF */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-line bg-bg-2 text-ink hover:border-brand hover:text-brand transition-all cursor-pointer"
          title={t('actions.print_tooltip')}
        >
          <Printer size={14} />
          <span>{t('actions.print')}</span>
        </button>
      </div>
    </div>
  );
}
