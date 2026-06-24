import { useEffect, useMemo, useState } from 'react';

import { callTool, getTools, type ToolDef } from '@/lib/api';
import { ResultView, type ResultState } from '@/components/ResultView';
import { SchemaForm } from '@/components/SchemaForm';
import { ToolList } from '@/components/ToolList';

type Health = { status?: string; indexed?: number; model?: string };

export default function App() {
  const [tools, setTools] = useState<ToolDef[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState>({ status: 'idle' });
  const [health, setHealth] = useState<Health | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getTools()
      .then((t) => {
        setTools(t);
        setSelected((s) => s ?? t[0]?.name ?? null);
      })
      .catch((e) => setLoadError(String(e)));
    fetch('./health')
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const current = useMemo(() => tools.find((t) => t.name === selected) ?? null, [tools, selected]);

  async function run(args: Record<string, unknown>) {
    if (!current) return;
    setResult({ status: 'loading' });
    try {
      const value = await callTool(current.name, args);
      setResult({ status: 'done', value });
    } catch (e) {
      setResult({ status: 'done', value: { error: String(e) } });
    }
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold">Terminus RAG Playground</h1>
        {health && (
          <span className="text-xs text-gray-500">
            {health.status} · {health.indexed} indexed · {health.model}
          </span>
        )}
      </header>

      {loadError ? (
        <div role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Failed to load tools: {loadError}
        </div>
      ) : (
        <div className="grid grid-cols-[16rem_1fr] gap-6">
          <aside>
            <ToolList tools={tools} selected={selected} onSelect={setSelected} />
          </aside>
          <section className="flex flex-col gap-4">
            {current && <SchemaForm key={current.name} schema={current.inputSchema} onSubmit={run} />}
            <ResultView state={result} />
          </section>
        </div>
      )}
    </main>
  );
}
