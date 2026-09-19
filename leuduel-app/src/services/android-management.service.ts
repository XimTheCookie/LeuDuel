import { Injectable } from '@angular/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root',
})
export class AndroidManagementService {
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

  keepAwake() {
    if (Capacitor.isNativePlatform()) {
      KeepAwake.keepAwake();
    }
  }

  allowSleep() {
    if (Capacitor.isNativePlatform()) {
      KeepAwake.allowSleep();
    }
  }
}
