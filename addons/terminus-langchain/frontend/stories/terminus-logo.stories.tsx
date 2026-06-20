import type { Meta, StoryObj } from '@storybook/react-vite';

import { TerminusLogoSVG } from '@/components/icons/terminus';
import { LETTER_GROUPS, WIDTH, CELL_H } from '@/components/icons/terminus/glyphs';
import { WaveVariant } from '@/components/icons/terminus/variants/wave';

const meta: Meta<typeof TerminusLogoSVG> = {
  title: 'Icons/TerminusLogo',
  component: TerminusLogoSVG,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: { control: { type: 'number', min: 20, max: 600, step: 10 } },
    height: { control: { type: 'number', min: 5, max: 200, step: 5 } },
    className: { control: 'text' },
    variant: { control: 'select', options: ['phosphor', 'glitch', 'wave'] },
    animationMode: { control: 'select', options: ['default', 'hover'] },
  },
};

export default meta;
type Story = StoryObj<typeof TerminusLogoSVG>;

export const Default: Story = {
  args: { width: 160 },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
      {([40, 80, 160, 240, 320] as const).map((w) => (
        <div key={w} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, width: 36, textAlign: 'right', opacity: 0.5 }}>
            {w}px
          </span>
          <TerminusLogoSVG width={w} />
        </div>
      ))}
    </div>
  ),
};

export const Phosphor: Story = {
  args: { width: 240, variant: 'phosphor' },
};

export const Glitch: Story = {
  args: { width: 240, variant: 'glitch' },
};

// TEMPORARY: live controls for tuning the wave squeeze (dur) and particle slide
// speed (stepDivisor). Renders WaveVariant directly so the props can be wired to
// Storybook number controls. Remove once the timing is dialed in.
export const Wave: StoryObj<{
  width: number;
  dur: number;
  stepDivisor: number;
  intraPairGap: number;
  pairGap: number;
  dashWidth: number;
}> = {
  argTypes: {
    width: { control: { type: 'number', min: 20, max: 600, step: 10 } },
    dur: { control: { type: 'number', min: 0.1, step: 0.1 } },
    stepDivisor: { control: { type: 'number', min: 1, max: 128, step: 1 } },
    intraPairGap: { control: { type: 'number', step: 0.1 } },
    pairGap: { control: { type: 'number', step: 0.1 } },
    dashWidth: { control: { type: 'number', min: 1, max: 20, step: 1 } },
  },
  args: {
    width: 240,
    dur: 1,
    stepDivisor: 30.5,
    intraPairGap: 1.3,
    pairGap: 3,
    dashWidth: 4,
  },
  render: ({ dashWidth, dur, intraPairGap, pairGap, stepDivisor, width }) => (
    <svg
      width={width}
      viewBox={`0 0 ${WIDTH} ${CELL_H}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Terminus"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Terminus</title>
      <WaveVariant
        letterGroups={LETTER_GROUPS}
        dur={dur}
        stepDivisor={stepDivisor}
        intraPairGap={intraPairGap}
        pairGap={pairGap}
        dashWidth={dashWidth}
      />
    </svg>
  ),
};

export const HoverMode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'flex-start' }}>
      {(['phosphor', 'glitch', 'wave'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, width: 60, opacity: 0.5 }}>{v}</span>
          <TerminusLogoSVG width={240} variant={v} animationMode="hover" />
        </div>
      ))}
    </div>
  ),
};

export const ColorInheritance: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {(
        [
          { label: 'foreground (default)', color: 'currentColor' },
          { label: 'muted', color: '#6b7280' },
          { label: 'accent blue', color: '#3b82f6' },
          { label: 'accent amber', color: '#f59e0b' },
          { label: 'destructive', color: '#ef4444' },
        ] as const
      ).map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, width: 140, opacity: 0.8 }}>{label}</span>
          <TerminusLogoSVG width={160} />
        </div>
      ))}
    </div>
  ),
};
