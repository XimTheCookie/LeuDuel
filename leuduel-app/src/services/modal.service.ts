import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Type } from '@angular/core';
import {
  ModalGenericComponent,
  MODAL_DATA,
} from '../components/common/modal-generic/modal-generic.component';

export interface ModalConfig {
  size: 'full' | 'md' | 'sm';
  mirror?: boolean;
  closeEvent?: () => void;
  opacity?: number;
}

export interface ModalRef {
  close: () => void;
  overlayRef: OverlayRef;
}

const SIZE_STYLES: Record<ModalConfig['size'], { width: string; height: string }> = {
  full: { width: '100vw', height: '100vh' },
  md: { width: '95vw', height: '95vh' },
  sm: { width: '88vw', height: 'auto' },
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) {}

  open<T>(component: Type<T>, config: ModalConfig): ModalRef {
    const { width, height } = SIZE_STYLES[config.size];

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
      providers: [{ provide: MODAL_DATA, useValue: { component, config, overlayRef } }],
    });

    overlayRef.attach(new ComponentPortal(ModalGenericComponent, null, injector));
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

    return { close: () => overlayRef.dispose(), overlayRef };
  }
}
