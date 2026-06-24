import { useState, type FormEvent } from 'react';

import type { JsonSchema } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  schema: JsonSchema;
  onSubmit: (args: Record<string, unknown>) => void;
};

export function SchemaForm({ schema, onSubmit }: Props) {
  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const [values, setValues] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const args: Record<string, unknown> = {};
    for (const [key, prop] of Object.entries(properties)) {
      const raw = values[key];
      if (raw === undefined || raw === '') continue; // omit blank optionals
      args[key] = prop.type === 'integer' ? Number(raw) : raw;
    }
    onSubmit(args);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {Object.entries(properties).map(([key, prop]) => (
        <label key={key} className="flex flex-col gap-1 text-sm">
          <span>
            {key}
            {required.has(key) ? ' *' : ''}
          </span>
          {prop.enum ? (
            <select
              aria-label={key}
              className="rounded border px-2 py-1"
              value={values[key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            >
              <option value="">—</option>
              {prop.enum.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <Input
              aria-label={key}
              type={prop.type === 'integer' ? 'number' : 'text'}
              value={values[key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
          )}
        </label>
      ))}
      <Button type="submit" className="self-start">
        Run
      </Button>
    </form>
  );
}
