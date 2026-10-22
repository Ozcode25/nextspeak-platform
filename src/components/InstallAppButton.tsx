'use client';

import * as React from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * "Install app" button for the home page.
 *
 * - Chrome / Edge / Android: appears once the browser fires `beforeinstallprompt`.
 * - iOS Safari: the event never fires, so we show the Share → Add to Home Screen hint instead.
 * - Other browsers: hidden (the install section still explains how to bookmark).
 */
export function InstallAppButton() {
  const deferredPrompt = React.useRef<BeforeInstallPromptEvent | null>(null);
  const [installable, setInstallable] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    const ua = window.navigator.userAgent;
    // iPhone / iPad Safari (iPadOS 13+ reports Macintosh, hence the touch check).
    setIsIOS(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setInstallable(true);
    };
    const onInstalled = () => {
      deferredPrompt.current = null;
      setInstallable(false);
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    const promptEvent = deferredPrompt.current;
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice; // user may dismiss — keep it simple
    deferredPrompt.current = null;
    setInstallable(false);
  };

  if (installed) {
    return (
      <p className="text-sm font-medium text-green-700 dark:text-green-400" role="status">
        ✅ NextSpeak is installed — open it from your home screen!
      </p>
    );
  }

  if (installable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Install NextSpeak
      </button>
    );
  }

  if (isIOS) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        On iPhone / iPad: tap the <span aria-hidden="true">⬆️</span> <strong>Share</strong> button in Safari,
        then choose <strong>Add to Home Screen</strong>.
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-600 dark:text-gray-300">
      Open this site in your browser’s menu and choose <strong>Install app</strong> (or bookmark it).
    </p>
  );
}
