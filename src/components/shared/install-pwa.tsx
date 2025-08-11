
"use client"

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { Card } from "../ui/card";

// Define the type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

interface InstallPWAProps {
    displayType: 'button' | 'card';
}

export default function InstallPWA({ displayType = 'card' }: InstallPWAProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownloadClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
  };

  if (!deferredPrompt || isAppInstalled) {
    return null;
  }

  if (displayType === 'button') {
    return (
        <Button size="lg" variant="outline" onClick={handleDownloadClick}>
            <Download className="mr-2 h-5 w-5" />
            Download App
        </Button>
    )
  }

  return (
    <Card className="p-4 bg-muted/50">
        <div className="flex items-center justify-between">
        <div>
            <p className="font-medium">Get the App</p>
            <p className="text-sm text-muted-foreground">Install Francisco Edibles on your home screen.</p>
        </div>
        <Button onClick={handleDownloadClick}>
            <Download className="mr-2 h-4 w-4" />
            Install
        </Button>
        </div>
    </Card>
  );
}
