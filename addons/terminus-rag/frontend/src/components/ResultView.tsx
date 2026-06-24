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
            className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
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
        <pre className="overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
          {JSON.stringify(state.value.result, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
