import * as RadixAvatar from '@radix-ui/react-avatar';

type AvatarSize = 'sm' | 'md' | 'lg';

type AvatarProps = {
    src?: string;
    alt?: string;
    fallback?: string;
    className?: string;
    size?: AvatarSize | number;
};

const SIZE_MAP: Record<AvatarSize, number> = {
    sm: 32,
    md: 40,
    lg: 56,
};

export default function Avatar({ src, alt, fallback = 'U', className, size = 'md' }: AvatarProps) {
    const finalSize = size ? (typeof size === 'string' ? SIZE_MAP[size] : size) : 40;

    return (
        <RadixAvatar.Root
            className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}
            style={{ width: finalSize, height: finalSize }}
        >
            <RadixAvatar.Image src={src} alt={alt} className="h-full w-full object-cover" />
            <RadixAvatar.Fallback
                delayMs={300}
                className="flex h-full w-full items-center justify-center bg-zinc-100 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                style={{ fontSize: finalSize * 0.4 }}
            >
                {fallback}
            </RadixAvatar.Fallback>
        </RadixAvatar.Root>
    );
}
