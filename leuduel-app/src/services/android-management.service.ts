import { Injectable } from '@angular/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';
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
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Dark });
    }
  }

  setStatusBarLight() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Light });
    }
  }

  async isKeepAwakeAllowed(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const res = await KeepAwake.isSupported();
      return res.isSupported.valueOf();
    }
    return Promise.resolve(false);
  }

  keepAwake() {
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
}
