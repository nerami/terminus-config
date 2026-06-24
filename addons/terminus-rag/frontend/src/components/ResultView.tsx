import type { CallResult } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

export type ResultState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; value: CallResult };

export function ResultView({ state }: { state: ResultState }) {
  if (state.status === 'idle') {
    return (
      <Card size="sm">
        <CardContent>
          <p className="text-sm text-muted-foreground">Run a tool to see its result.</p>
        </CardContent>
      </Card>
    );
  }

  if (state.status === 'loading') {
    return (
      <Card size="sm">
        <CardContent>
          <p className="text-sm text-muted-foreground">Running…</p>
        </CardContent>
      </Card>
    );
  }

  if (state.value.error !== undefined) {
    return (
      <Card size="sm">
        <CardContent>
          <div
            role="alert"
            className="border-destructive/40 bg-destructive/10 text-destructive rounded border p-3 text-sm"
          >
            {state.value.error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm">
      <CardContent>
        <pre className="bg-muted text-foreground overflow-auto rounded p-3 text-xs">
          {JSON.stringify(state.value.result, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
