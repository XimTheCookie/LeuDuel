import {
  Component,
  Inject,
  InjectionToken,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Type,
  inject,
  computed,
} from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { ModalConfig } from '../../../services/modal/modal.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { TutorialService } from '../../../services/tutorial/tutorial.service';
import { TutorialComponent } from '../tutorial/tutorial.component';

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
  imports: [TutorialComponent],
})
export class ModalGenericComponent implements OnInit {
  private readonly settingsService = inject(SettingsService);
  readonly tutorial = inject(TutorialService);

  opacity = computed(() => this.settingsService.getModalOpacity());

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
