import * as React from 'react';

import { Loader2 } from 'lucide-react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
    className?: string;
}

const Loader = ({ size = 24, className = '', ...props }: LoaderProps) => {
    return (
        <div className={`flex items-center justify-center ${className}`} {...props}>
            <Loader2 size={size} className="animate-spin text-primary" />
        </div>
    );
};

export { Loader };
