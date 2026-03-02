import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'end' | 'start' | 'center';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'start' }) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <div className="cursor-pointer">{trigger}</div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    side="bottom"
                    align={align}
                    sideOffset={12}
                    className="
                        min-w-64 z-60 max-w-120 rounded-lg border
                        border-zinc-200 bg-white shadow-lg
                        dark:border-zinc-800 dark:bg-zinc-900
                        outline-none
                         data-[state=open]:animate-dropdown-in
                        data-[state=closed]:animate-dropdown-out
                    "
                >
                    {/* Arrow
                    <DropdownMenu.Arrow
                        className="
                            fill-white
                            dark:fill-zinc-900
                            stroke-zinc-200
                            dark:stroke-zinc-800
                        "
                        width={12}
                        height={6}
                    /> */}
                    {children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
