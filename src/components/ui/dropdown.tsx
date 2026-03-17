import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'end' | 'start' | 'center';
    className?: string;
    id?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'start', className, id }) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <div className="cursor-pointer" id={id}>
                    {trigger}
                </div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    side="bottom"
                    align={align}
                    sideOffset={12}
                    className={`
                        min-w-64 z-60 rounded-xl border
                        border-card-border bg-card-bg shadow-xl
                        outline-none
                        data-[state=open]:animate-dropdown-in
                        data-[state=closed]:animate-dropdown-out
                        ${className || ''}
                    `}
                >
                    {children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
