import * as React from 'react';

import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: React.ReactNode;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className = '', variant = 'default', size = 'default', loading = false, disabled, ...props }, ref) => {
        const baseStyles =
            'flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors cursor-pointer \
            focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50';

        const variants = {
            default: 'bg-primary text-white hover:opacity-90',
            outline: 'border border-border bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800',
            ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
            secondary:
                'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700',
            link: 'text-primary underline-offset-4 hover:underline',
        };

        const sizes = {
            default: 'h-9 px-4',
            sm: 'h-8 px-3 text-xs',
            lg: 'h-10 px-8',
            icon: 'h-9 w-9',
        };

        const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

        return (
            <button
                ref={ref}
                className={combinedClassName}
                disabled={disabled || loading}
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                {...props}
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';

export { Button };
