import { Injectable } from '@angular/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root',
})
export class AndroidManagementService {
  isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  setStatusBarDark() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setBackgroundColor({ color: '#070808' });
    }
  }

  setStatusBarLight() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setBackgroundColor({ color: '#f0f4fb' });
    }
  }

  async isKeepAwakeAllowed(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const res = await KeepAwake.isSupported();
      return res.isSupported.valueOf();
    }
    return Promise.resolve(false);
  }

  keepAwake(enabled: boolean) {
    if (!enabled) return;
    this.isKeepAwakeAllowed().then((isAllowed) => {
      if (isAllowed) {
        KeepAwake.keepAwake();
      }
    });
  }

  allowSleep() {
    if (Capacitor.isNativePlatform()) {
      KeepAwake.allowSleep();
    }
  }

  setOrientation(landscape: boolean) {
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({ orientation: landscape ? 'landscape' : 'portrait' });
    }
  }
}
