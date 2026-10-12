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
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: 'minmax(0, 1fr)',
        minHeight: '100%',
      }}
    >
      <nav className="demo-nav" aria-label="Demos">
        <strong className="demo-brand">pdf-anchor</strong>
        {(Object.keys(demos) as DemoName[]).map((name) => (
          <button
            key={name}
            type="button"
            className="demo-tab"
            onClick={() => setActive(name)}
            aria-pressed={name === active}
          >
            {name}
          </button>
        ))}
      </nav>
      <Demo />
    </div>
  );
}
