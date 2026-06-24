import { useEffect, useMemo, useState } from 'react';

import { callTool, getTools, type Health, type ToolDef } from '@/lib/api';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ResultView, type ResultState } from '@/components/ResultView';
import { SchemaForm } from '@/components/SchemaForm';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

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
    <SidebarProvider>
      <AppSidebar tools={tools} selected={selected} onSelect={setSelected} health={health} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold">Terminus RAG Playground</h1>
        </header>
        <div className="p-6">
          {loadError ? (
            <div role="alert" className="border-destructive/40 bg-destructive/10 text-destructive rounded border p-3 text-sm">
              Failed to load tools: {loadError}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: the selected tool — name, description, inputs. */}
              <section className="flex flex-col gap-4">
                {current && (
                  <>
                    <div className="flex flex-col gap-1">
                      <h2 className="font-mono text-base font-semibold">{current.name}</h2>
                      <p className="text-muted-foreground text-sm">{current.description}</p>
                    </div>
                    <SchemaForm key={current.name} schema={current.inputSchema} onSubmit={run} />
                  </>
                )}
              </section>
              {/* Right: the result block. */}
              <section>
                <ResultView state={result} />
              </section>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
