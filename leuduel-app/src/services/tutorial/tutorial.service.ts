import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SettingsPageComponent } from '../../pages/settings-page/settings-page.component';
import { ModalRef, ModalService } from '../modal/modal.service';
import { AndroidManagementService } from '../android/android-management.service';

interface TutorialStep {
  message: string;
  targetId?: string;
  targetClasses?: string;
  positionV: 'center' | 'start' | 'end';
  positionH: 'center' | 'start' | 'end';
  enterEvent?: () => void;
  beforeReEnter?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  private readonly androidManagementService = inject(AndroidManagementService);
  private readonly modalService = inject(ModalService);

  private settingsModalRef: ModalRef | null = null;

  private steps = computed<TutorialStep[]>(() => {
    const steps: TutorialStep[] = [
      {
        message: 'tutorial.step.000a',
        positionV: 'center',
        positionH: 'center',
      },
      {
        message: 'tutorial.step.000b',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: 'tutorial.step.000c',
        targetClasses: 'leu-lbl-lp',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: 'tutorial.step.000d',
        targetClasses: 'leu-ico-win',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: 'tutorial.step.000e',
        targetId: 'leu-ctn-controller',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: 'tutorial.step.000f',
        targetId: 'leu-lbl-timer',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: 'tutorial.step.000g',
        targetId: 'leu-btn-match',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: 'tutorial.step.000h',
        targetId: 'leu-btn-counters',
        positionV: 'end',
        positionH: 'start',
      },
      {
        message: 'tutorial.step.000i',
        targetId: 'leu-btn-tools',
        positionV: 'end',
        positionH: 'start',
      },
      {
        message: 'tutorial.step.000j',
        targetId: 'leu-btn-rules',
        positionV: 'end',
        positionH: 'start',
      },
      {
        message: 'tutorial.step.000k',
        targetId: 'leu-btn-sounds',
        positionV: 'end',
        positionH: 'start',
      },
      {
        message: 'tutorial.step.000l',
        targetId: 'leu-btn-logs',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: 'tutorial.step.000m',
        targetId: 'leu-btn-reset',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: 'tutorial.step.000n',
        targetId: 'leu-btn-stop',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: 'tutorial.step.000o',
        targetId: 'leu-btn-stop',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: 'tutorial.step.000p',
        targetId: 'leu-btn-settings',
        positionV: 'end',
        positionH: 'end',
        beforeReEnter: () => {
          this.closeSettings();
        },
      },
      {
        message: 'tutorial.step.000q',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          this.openSettings();
        },
      },
      {
        message: 'tutorial.step.000r',
        targetId: 'leu-ctn-duelsettings',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document
            .getElementById('leu-ctn-duelsettings')
            ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        },
      },
      {
        message: 'tutorial.step.000s',
        targetId: 'leu-ctn-lp',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-lp')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: 'tutorial.step.000t',
        targetId: 'leu-ctn-bo',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-bo')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: 'tutorial.step.000u',
        targetId: 'leu-ctn-duration',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-duration')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: 'tutorial.step.000v',
        targetId: 'leu-ctn-cprofiles',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-cprofiles')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: 'tutorial.step.000w',
        targetId: 'leu-btn-randompicker',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-btn-randompicker')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: 'tutorial.step.000x',
        targetId: 'leu-ctn-uisettings',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document
            .getElementById('leu-ctn-uisettings')
            ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        },
      },
      {
        message: 'tutorial.step.000y',
        targetId: 'leu-ctn-lsm',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-lsm')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: 'tutorial.step.000z',
        targetId: 'leu-ctn-rbs',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-rbs')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: 'tutorial.step.00a0',
        targetClasses: 'leu-ctn-rbs-0',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-rbs')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
    ];

    if (this.androidManagementService.isAndroid()) {
      steps.push({
        message: 'tutorial.step.00b0',
        targetId: 'leu-ctn-android',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document
            .getElementById('leu-ctn-android')
            ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        },
      });
    }

    steps.push(
      {
        message: 'tutorial.step.00c0',
        targetId: 'leu-ctn-besettings',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document
            .getElementById('leu-ctn-besettings')
            ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        },
      },
      {
        message: 'tutorial.step.00d0',
        targetId: 'leu-ctn-besettings',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document
            .getElementById('leu-ctn-besettings')
            ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        },
      },
      {
        message: 'tutorial.step.00e0',
        targetId: 'leu-btn-tutorial',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-btn-tutorial')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
    );

    return steps;
  });
  readonly tutorialMode = signal(false);
  currentStepIndex = signal(0);
  currentStep = computed(() => {
    if (!this.tutorialMode()) return null;
    const step = this.steps()[this.currentStepIndex()];
    this.addHighlight(step);

    return step;
  });

  isLastStep = computed(() => this.currentStepIndex() === this.steps().length - 1);

  startTutorial() {
    this.currentStepIndex.set(0);
    this.tutorialMode.set(true);
  }

  nextStep() {
    this.removeHighlights();
    if (this.currentStepIndex() < this.steps().length - 1) {
      this.currentStepIndex.update((index) => index + 1);
      if (this.steps()[this.currentStepIndex()].enterEvent) {
        this.steps()[this.currentStepIndex()].enterEvent?.();
      }
    }
  }

  prevStep() {
    this.removeHighlights();
    if (this.currentStepIndex() > 0) {
      const prevIndex = this.currentStepIndex() - 1;
      this.steps()[prevIndex].beforeReEnter?.();
      this.currentStepIndex.set(prevIndex);
      this.steps()[prevIndex].enterEvent?.();
    }
  }

  stopTutorial() {
    this.tutorialMode.set(false);
    this.removeHighlights();
    this.closeSettings();
  }

  private addHighlight(step: TutorialStep) {
    if (step.targetId) document.getElementById(step.targetId)?.classList.add('t-highlight');
    if (step.targetClasses)
      document
        .querySelectorAll(`.${step.targetClasses}`)
        .forEach((el) => el?.classList?.add('t-highlight'));
  }

  private removeHighlights() {
    document.querySelectorAll('.t-highlight').forEach((el) => {
      el.classList.remove('t-highlight');
    });
  }

  private openSettings() {
    if (this.settingsModalRef) return;
    this.settingsModalRef = this.modalService.open(
      SettingsPageComponent,
      {
        size: 'full',
        closeEvent: () => {
          this.settingsModalRef = null;
        },
      },
      undefined,
      false,
    );
  }

  private closeSettings() {
    if (this.settingsModalRef) {
      this.settingsModalRef.close();
      this.settingsModalRef = null;
    }
  }
}
