import {
  Component,
  Inject,
  InjectionToken,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { ModalConfig } from '../../../services/modal/modal.service';

export const MODAL_DATA = new InjectionToken<{
  component: Type<unknown>;
  config: ModalConfig;
  overlayRef: OverlayRef;
}>('MODAL_DATA');

@Component({
  selector: 'app-modal-generic',
  standalone: true,
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss'],
})
export class ModalGenericComponent implements OnInit {
  @ViewChild('content', { read: ViewContainerRef, static: true })
  contentRef!: ViewContainerRef;

  constructor(
    @Inject(MODAL_DATA)
    public data: {
      component: Type<unknown>;
      config: ModalConfig;
      overlayRef: OverlayRef;
    },
  ) {}

  ngOnInit() {
    this.contentRef.createComponent(this.data.component);
  }

  close() {
    this.data.overlayRef.dispose();
    this.data.config.closeEvent?.();
  }
}
