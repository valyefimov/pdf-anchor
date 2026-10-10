import { useState } from 'react';
import { BasicDemo } from './demos/BasicDemo';
import { DocsDemo } from './demos/DocsDemo';
import { CustomSlotsDemo } from './demos/CustomSlotsDemo';
import { HeadlessDemo } from './demos/HeadlessDemo';
import { ThemedDemo } from './demos/ThemedDemo';

const demos = {
  Docs: DocsDemo,
  Basic: BasicDemo,
  Themed: ThemedDemo,
  'Custom slots': CustomSlotsDemo,
  Headless: HeadlessDemo,
} as const;

type DemoName = keyof typeof demos;

export function App() {
  const [active, setActive] = useState<DemoName>('Basic');
  const Demo = demos[active];

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100%' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          background: 'linear-gradient(90deg, #0f172a, #1e1b4b)',
        }}
      >
        <strong style={{ marginRight: 12, color: 'white', letterSpacing: '-0.01em' }}>
          pdf-anchor
        </strong>
        {(Object.keys(demos) as DemoName[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            aria-pressed={name === active}
            style={{
              padding: '6px 12px',
              border: 0,
              borderRadius: 999,
              color: 'white',
              cursor: 'pointer',
              background: name === active ? '#2563eb' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <Demo />
    </div>
  );
}
