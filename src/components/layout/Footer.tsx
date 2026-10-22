import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2" aria-label="NextSpeak home">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5 dark:ring-white/10"
              aria-hidden="true"
            >
              <Image
                src="/icon-152.png"
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="font-display text-lg font-bold text-gray-900 dark:text-white">NextSpeak</span>
          </Link>
          <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
            Free beginner English lessons with interactive quizzes. Learn at your own pace, on any device.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Learn</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/lessons" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                All lessons
              </Link>
            </li>
            <li>
              <Link href="/progress" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                My progress
              </Link>
            </li>
            <li>
              <Link href="/#install" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Install the app
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">About</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>Created by Oldemar Almengor, English teacher</li>
            <li>
              <a href="mailto:contacto@nextspeak.com" className="hover:text-gray-900 dark:hover:text-white">
                contacto@nextspeak.com
              </a>
            </li>
            <li>Your progress stays on this device — no account, no tracking.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6 dark:border-gray-800">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} NextSpeak. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
