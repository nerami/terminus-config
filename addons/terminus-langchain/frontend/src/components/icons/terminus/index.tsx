import { memo } from "react";
import { CELLS, LETTER_GROUPS, WIDTH, CELL_H } from "./glyphs";
import { PhosphorVariant } from "./variants/phosphor";
import { GlitchVariant } from "./variants/glitch";
import { WaveVariant } from "./variants/wave";

export type TerminusVariant = "phosphor" | "glitch" | "wave";
export type AnimationMode = "default" | "hover";

export const TerminusLogoSVG = memo(function TerminusLogoSVG({
  className,
  width,
  height,
  variant,
  animationMode,
}: {
  width?: number;
  height?: number;
  className?: string;
  variant?: TerminusVariant;
  animationMode?: AnimationMode;
}) {
  const hoverMode = animationMode === "hover";
  const svgClass = [className, hoverMode ? "terminus-anim-hover" : ""]
    .filter(Boolean)
    .join(" ") || undefined;
  return (
    <svg
      width={width}
      height={height}
      className={svgClass}
      viewBox={`0 0 ${WIDTH} ${CELL_H}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Terminus"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Terminus</title>
      {variant === "phosphor" && <PhosphorVariant cells={CELLS} />}
      {variant === "glitch"   && <GlitchVariant cells={CELLS} />}
      {variant === "wave"     && <WaveVariant letterGroups={LETTER_GROUPS} />}
      {!variant && (
        <g>
          {CELLS.map(({ x, y, key }) => (
            <rect key={key} x={x} y={y} width={1} height={1} />
          ))}
        </g>
      )}
    </svg>
  );
});
