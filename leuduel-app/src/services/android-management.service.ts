import { inject, Injectable } from '@angular/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class AndroidManagementService {
  private readonly settingService = inject(SettingsService);

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
    if (this.settingService.getKeepAwake() === false) return;
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
