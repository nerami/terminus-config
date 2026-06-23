import { forwardRef } from 'react';

import { type VariantProps } from 'class-variance-authority';

import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type TooltipIconButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    tooltip: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
  };

export const TooltipIconButton = forwardRef<HTMLButtonElement, TooltipIconButtonProps>(
  ({ children, className, side = 'bottom', size = 'icon', tooltip, variant = 'ghost', ...rest }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant={variant} size={size} className={className} {...rest} ref={ref} />}>
            {children}
            <span className="sr-only">{tooltip}</span>
          </TooltipTrigger>
          <TooltipContent side={side}>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

TooltipIconButton.displayName = 'TooltipIconButton';
