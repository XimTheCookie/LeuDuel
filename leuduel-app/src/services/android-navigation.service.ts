import { Injectable, OnDestroy } from '@angular/core';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

@Injectable({
  providedIn: 'root',
})
export class AndroidNavigationService implements OnDestroy {
  private handlers: (() => void)[] = [];
  private listener?: PluginListenerHandle;
  private lastBackPress = 0;

  constructor() {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('backButton', () => {
        if (this.handlers.length > 0) {
          this.handlers[this.handlers.length - 1]();
        } else {
          const now = Date.now();
          if (now - this.lastBackPress < 2000) {
            CapacitorApp.exitApp();
          } else {
            this.lastBackPress = now;
          }
        }
      }).then((l) => (this.listener = l));
    }
  }

  register(handler: () => void): () => void {
    this.handlers.push(handler);
    return () => (this.handlers = this.handlers.filter((h) => h !== handler));
  }

  ngOnDestroy() {
    this.listener?.remove();
  }
}
