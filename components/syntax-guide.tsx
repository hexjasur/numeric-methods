'use client';

import { PsHero, PsStrip, PsPanel, PsPanelHead } from '@/components/ui/print-stream';
import { useI18n } from '@/components/i18n-provider';
import katex from 'katex';

export function SyntaxGuide() {
  const { t } = useI18n();

  const mathRender = (tex: string) => 
    <span dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: false }) }} />;

  return (
    <div className="relative max-w-[900px] mx-auto px-4 pb-12">
      <PsStrip eyebrow="DOC-001" id="SYNTAX" name={t('syntax.strip')} />

      <PsHero 
        eyebrow={t('syntax.hero_eyebrow')}
        title={<>{t('syntax.hero_title')} <em>{t('syntax.hero_titleHighlight')}</em>{t('syntax.hero_title_suffix')}</>}
        titleHighlight=""
        lead={t('syntax.hero_lead')}
      />

      <PsPanel className="mb-[18px]">
        <PsPanelHead eyebrow={t('syntax.op_eyebrow')} title={t('syntax.op_title')} idx="01" />
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[14px]">
            <thead className="text-muted border-b border-line">
              <tr>
                <th className="py-2.5 pr-4 font-semibold">{t('syntax.th_op')}</th>
                <th className="py-2.5 px-4 font-semibold text-brand">{t('syntax.th_write')}</th>
                <th className="py-2.5 pl-4 font-semibold text-cyan">{t('syntax.th_res')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.op_mul')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">2 * x</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('2x')}</td>
              </tr>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.op_pow')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">x ^ 2</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('x^2')}</td>
              </tr>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.op_div')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">(x+1) / (x-1)</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('\\frac{x+1}{x-1}')}</td>
              </tr>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.op_sqrt')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">sqrt(x)</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('\\sqrt{x}')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PsPanel>

      <PsPanel>
        <PsPanelHead eyebrow={t('syntax.fn_eyebrow')} title={t('syntax.fn_title')} idx="02" />
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[14px]">
            <thead className="text-muted border-b border-line">
              <tr>
                <th className="py-2.5 pr-4 font-semibold">{t('syntax.th_op')}</th>
                <th className="py-2.5 px-4 font-semibold text-brand">{t('syntax.th_write')}</th>
                <th className="py-2.5 pl-4 font-semibold text-cyan">{t('syntax.th_res')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.fn_trig')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">sin(x), cos(x), tan(x)</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('\\sin(x), \\cos(x), \\tan(x)')}</td>
              </tr>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.fn_exp')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">e^x, exp(x)</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('e^x')}</td>
              </tr>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.fn_ln')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">log(x)</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('\\ln(x)')}</td>
              </tr>
              <tr className="border-b border-line-2 hover:bg-bg-2">
                <td className="py-3 pr-4 text-ink">{t('syntax.fn_log10')}</td>
                <td className="py-3 px-4 text-brand bg-brand-soft font-bold">log10(x)</td>
                <td className="py-3 pl-4 text-cyan">{mathRender('\\log_{10}(x)')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PsPanel>
    </div>
  );
}
