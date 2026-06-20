import { forwardRef } from 'react';

import { type VariantProps } from 'class-variance-authority';

import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type TooltipIconButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    tooltip: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
  };

export const TooltipIconButton = forwardRef<HTMLButtonElement, TooltipIconButtonProps>(
  ({ children, className, side = 'bottom', tooltip, ...rest }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon" {...rest} className={cn('size-6 p-1', className)} ref={ref} />}
          >
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
