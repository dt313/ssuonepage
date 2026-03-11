import { Loader } from '@/components/ui/loader';

export function AuthLoading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950">
            <Loader className="h-8 w-8 text-primary" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Authenticating with u-SAINT...
            </p>
        </div>
    );
}
