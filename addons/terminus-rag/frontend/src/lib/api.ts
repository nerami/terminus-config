export type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  enum?: string[];
  description?: string;
};

export type ToolDef = {
  name: string;
  description: string;
  inputSchema: JsonSchema;
};

export type CallResult = { result?: unknown; error?: string };

export type Health = { status?: string; indexed?: number; model?: string };

export async function getTools(): Promise<ToolDef[]> {
  const res = await fetch('./playground/tools');
  if (!res.ok) throw new Error(`getTools failed: ${res.status}`);
  const body = (await res.json()) as { tools: ToolDef[] };
  return body.tools;
}

export async function callTool(
  name: string,
  args: Record<string, unknown>,
): Promise<CallResult> {
  const res = await fetch('./playground/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: name, args }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as CallResult;
    return { error: body.error ?? `call failed: ${res.status}` };
  }
  return (await res.json()) as CallResult;
}
