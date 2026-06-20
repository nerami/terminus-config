import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Boxes,
  Clapperboard,
  Cog,
  Columns2,
  Cpu,
  Filter,
  GitBranch,
  GitFork,
  Home,
  List,
  Octagon,
  Repeat,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import type { GraphNodeData, NodeKind } from '@/lib/ha-graph/build';

import { cn } from '@/lib/utils';

const KIND_ICON: Record<NodeKind, LucideIcon> = {
  area: Home,
  group: Boxes,
  entity: Cpu,
  scene: Clapperboard,
  automation: Workflow,
  trigger: Zap,
  condition: Filter,
  logic: GitBranch,
  action: Cog,
  choose: GitFork,
  if: GitBranch,
  repeat: Repeat,
  parallel: Columns2,
  sequence: List,
  stop: Octagon,
};

// Accent colors keyed to the theme chart variables so nodes match the app.
const KIND_ACCENT: Record<NodeKind, string> = {
  area: 'var(--chart-3)',
  group: 'var(--muted-foreground)',
  entity: 'var(--chart-1)',
  scene: 'var(--chart-4)',
  automation: 'var(--chart-2)',
  trigger: 'var(--chart-2)',
  condition: 'var(--chart-4)',
  logic: 'var(--muted-foreground)',
  action: 'var(--chart-1)',
  choose: 'var(--chart-2)',
  if: 'var(--chart-2)',
  repeat: 'var(--chart-3)',
  parallel: 'var(--chart-3)',
  sequence: 'var(--muted-foreground)',
  stop: 'var(--destructive)',
};

function NodeShell({
  accent,
  className,
  data,
  icon: Icon,
}: {
  data: GraphNodeData;
  accent: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-card flex max-w-[220px] min-w-[150px] items-center gap-2 border px-3 py-2 shadow-sm transition-all',
        data.interactive && 'cursor-pointer hover:shadow-md',
        data.dimmed && 'opacity-25',
        data.emphasized && 'ring-2 ring-offset-1',
        data.isSelected && 'ring-primary ring-2 ring-offset-2',
        className,
      )}
      style={data.emphasized && !data.isSelected ? ({ '--tw-ring-color': accent } as React.CSSProperties) : undefined}
    >
      <span className="flex size-7 shrink-0 items-center justify-center text-white" style={{ backgroundColor: accent }}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{data.label}</div>
        {data.sublabel && <div className="text-muted-foreground truncate text-xs">{data.sublabel}</div>}
      </div>
    </div>
  );
}

function withHandles(node: React.ReactNode) {
  return (
    <>
      <Handle type="target" position={Position.Top} className="!size-1.5 !border-0 !bg-transparent" />
      {node}
      <Handle type="source" position={Position.Bottom} className="!size-1.5 !border-0 !bg-transparent" />
    </>
  );
}

function makeNode(kind: NodeKind) {
  return function GraphNode({ data }: NodeProps) {
    const d = data as GraphNodeData;
    return withHandles(<NodeShell data={d} accent={KIND_ACCENT[kind]} icon={KIND_ICON[kind]} />);
  };
}

function GroupNode({ data }: NodeProps) {
  const d = data as GraphNodeData;
  return (
    <div className="bg-muted text-foreground border-border border-l-foreground flex items-center gap-2 border border-b-2 border-l-4 px-3 py-1.5 shadow-sm">
      <Boxes className="text-muted-foreground size-4 shrink-0" />
      <span className="text-xs font-semibold tracking-wider uppercase">{d.label}</span>
      {d.sublabel && (
        <span className="bg-accent text-muted-foreground ml-auto px-1.5 py-0.5 text-xs font-medium tabular-nums">
          {d.sublabel}
        </span>
      )}
    </div>
  );
}

export const nodeTypes = {
  area: makeNode('area'),
  entity: makeNode('entity'),
  scene: makeNode('scene'),
  automation: makeNode('automation'),
  trigger: makeNode('trigger'),
  condition: makeNode('condition'),
  logic: makeNode('logic'),
  action: makeNode('action'),
  choose: makeNode('choose'),
  if: makeNode('if'),
  repeat: makeNode('repeat'),
  parallel: makeNode('parallel'),
  sequence: makeNode('sequence'),
  stop: makeNode('stop'),
  group: GroupNode,
};
