import type { ToolDef } from '@/lib/api';

type Props = {
  tools: ToolDef[];
  selected: string | null;
  onSelect: (name: string) => void;
};

export function ToolList({ tools, selected, onSelect }: Props) {
  return (
    <ul className="flex flex-col gap-1">
      {tools.map((t) => (
        <li key={t.name}>
          <button
            type="button"
            onClick={() => onSelect(t.name)}
            className={`w-full rounded px-2 py-1 text-left text-sm ${
              selected === t.name ? 'bg-blue-100 font-medium' : 'hover:bg-gray-100'
            }`}
          >
            <span className="font-mono">{t.name}</span>
            <span className="block text-xs text-gray-500">{t.description}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
