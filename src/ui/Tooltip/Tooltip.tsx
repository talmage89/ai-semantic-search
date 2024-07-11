import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import './Tooltip.scss';

type TooltipProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  arrow?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
};

export const Tooltip = ({ icon, children, arrow, ...props }: TooltipProps) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <div
            className="TooltipIconButton"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {icon}
          </div>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className="TooltipContent" sideOffset={5} {...props}>
            {children}
            {(arrow ?? true) && <RadixTooltip.Arrow className="TooltipArrow" />}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
