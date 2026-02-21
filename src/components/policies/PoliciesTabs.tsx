'use client';

import { useState } from 'react';

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyTab {
  slug: string;
  label: string;
  sections: PolicySection[];
}

interface PoliciesTabsProps {
  tabs: PolicyTab[];
}

export function PoliciesTabs({ tabs }: PoliciesTabsProps) {
  const [active, setActive] = useState(tabs[0]?.slug ?? '');

  const current = tabs.find((t) => t.slug === active);

  return (
    <div>
      {/* Tab nav */}
      <div className="border-border mb-8 flex overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActive(tab.slug)}
            className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
              active === tab.slug
                ? 'border-accent text-accent'
                : 'text-text-secondary hover:text-text border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {current && (
        <div className="space-y-6">
          {current.sections.map((section, i) => (
            <div key={i} className="border-border bg-surface rounded-2xl border p-6">
              {section.title && <h3 className="text-primary mb-3 font-bold">{section.title}</h3>}
              {section.content && (
                <div
                  className="text-text-secondary prose prose-sm max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          ))}

          {current.sections.length === 0 && (
            <div className="border-border rounded-2xl border p-8 text-center">
              <p className="text-text-muted">Contenido próximamente disponible.</p>
            </div>
          )}
        </div>
      )}

      <p className="text-text-muted mt-8 text-center text-xs">
        Última actualización: Febrero 2026 · Si tienes preguntas, contáctanos por WhatsApp.
      </p>
    </div>
  );
}
