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
      <nav style={{ display: 'flex', gap: 8, padding: 8, background: '#111827' }}>
        {(Object.keys(demos) as DemoName[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            aria-pressed={name === active}
            style={{
              padding: '6px 12px',
              border: 0,
              borderRadius: 6,
              color: 'white',
              cursor: 'pointer',
              background: name === active ? '#2563eb' : '#374151',
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
