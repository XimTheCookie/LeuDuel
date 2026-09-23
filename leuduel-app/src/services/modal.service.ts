import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, InjectionToken, Injector, Type } from '@angular/core';
import {
  ModalGenericComponent,
  MODAL_DATA,
} from '../components/common/modal-generic/modal-generic.component';
import { AndroidNavigationService } from './android-navigation.service';
import { AndroidManagementService } from './android-management.service';

export const MODAL_COMPONENT_DATA = new InjectionToken<unknown>('MODAL_COMPONENT_DATA');

export interface ModalConfig {
  size: 'full' | 'md' | 'sm';
  mirror?: boolean;
  closeEvent?: () => void;
  opacity?: number;
  hideClose?: boolean;
  custom?: any;
}

export interface ModalRef {
  close: () => void;
  overlayRef: OverlayRef;
}

const SIZE_STYLES: Record<ModalConfig['size'], { width: string; height?: string }> = {
  full: { width: '100vw', height: '100vh' },
  md: { width: '95vw', height: '95vh' },
  sm: { width: '88vw' },
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly androidNavigationService = inject(AndroidNavigationService);
  private readonly androidManagementService = inject(AndroidManagementService);

  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) {}

  private openCount = 0;

  get hasOpenModal(): boolean {
    return this.openCount > 0;
  }

  open<T>(component: Type<T>, config: ModalConfig, componentData?: unknown): ModalRef {
    const { width, height } = SIZE_STYLES[config.size];
    this.androidManagementService.hideStatusBar();
    const overlayRef = this.overlay.create({
      width,
      height,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
      backdropClass: 'modal-backdrop',
      panelClass: [`modal-panel`, `modal-${config.size}`, ...(config.mirror ? ['mirror'] : [])],
    });

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: MODAL_DATA, useValue: { component, config, overlayRef } },
        ...(componentData !== undefined
          ? [{ provide: MODAL_COMPONENT_DATA, useValue: componentData }]
          : []),
      ],
    });

    overlayRef.attach(new ComponentPortal(ModalGenericComponent, null, injector));
    setTimeout(() => overlayRef.updatePosition());
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    const unregister = this.androidNavigationService.register(() => overlayRef.dispose());
    overlayRef.detachments().subscribe(unregister);
    this.openCount++;
    overlayRef.detachments().subscribe(() => this.openCount--);

    return { close: () => overlayRef.dispose(), overlayRef };
  }
}
