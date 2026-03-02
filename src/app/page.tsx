import { ThemeToggleButton } from '@/components/theme-toggle-button';

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-zinc-900">
            <ThemeToggleButton />
            Hello World
        </div>
    );
}
