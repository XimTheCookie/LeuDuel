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
        message: `leuDuel comes with many features. Feel free to stop the tutorial at any time.`,
        positionV: 'center',
        positionH: 'center',
      },
      {
        message: `This section is used to modify players' LP. You can customise buttons by holding them, or change this section entirely in settings.`,
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: `This is player's life points count, tapping on it opens the LP Calculator.`,
        targetClasses: 'leu-lbl-lp',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: `These icons are used to display player's win count.`,
        targetClasses: 'leu-ico-win',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: `This section allows you to control the match and perform most actions.`,
        targetId: 'leu-ctn-controller',
        positionV: 'end',
        positionH: 'center',
      },
      {
        message: `This is the match timer. It continues past zero once it expires, but it can also stop the match if you prefer.`,
        targetId: 'leu-lbl-timer',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `The match button controls if the match is started or paused, this button cannot stop the match.
        On match start, additional prompts may be required depending on your preferences.`,
        targetId: 'leu-btn-match',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `Counter page allows you to manage counters on the field layout, they are normally reset on game start.`,
        targetId: 'leu-btn-counters',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `Toolbox includes dice roll and coin flip, previous rolls results are also displayed.`,
        targetId: 'leu-btn-tools',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `In ruling page you can look up for cards to quickly search for rulings or other infos. Advanced search options are described in the page.`,
        targetId: 'leu-btn-rules',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `You can mute app sounds at any time using this button.`,
        targetId: 'leu-btn-sounds',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `During a match, logs page lists all the Life Points changes that happened, you are free to undo any of them for the current game.`,
        targetId: 'leu-btn-logs',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `During a match, you can use the game reset button to reset player's life points and assign a victory to one.`,
        targetId: 'leu-btn-reset',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `During a match, you can use the stop button to stop the match entirely. leuDuel will suggest a potential winner based on win counts — this is purely informative.`,
        targetId: 'leu-btn-stop',
        positionV: 'end',
        positionH: 'end',
      },
      {
        message: `Finally, the settings button — not available during an active match.`,
        targetId: 'leu-btn-settings',
        positionV: 'end',
        positionH: 'end',
        enterEvent: () => {
          this.closeSettings();
        },
      },
      {
        message: `The settings page includes some options to customize leuDuel.`,
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          this.openSettings();
        },
      },
      {
        message: `Duel settings contains all the match-related settings.`,
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
        message: `You can customize life points amount on game start.`,
        targetId: 'leu-ctn-lp',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-lp')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: `You can customize number of games in a match, this changes the amount of win indicators and when the winner player is picked.`,
        targetId: 'leu-ctn-bo',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-bo')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: `Duel duration defines the timer for your match, notice that it doesnt end the match automatically.
        You can change it using hour, minute and seconds units.`,
        targetId: 'leu-ctn-duration',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-duration')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: `Custom profile allows you to pick a card art and a custom name for you and your opponents.
      When enabled, you will be prompt to pick your opponent on match start and these details will be displayed during the match.`,
        targetId: 'leu-ctn-cprofiles',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-cprofiles')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: `When pick random player is enabled, an extra window will appear on match start to randomly select a player using some fun randomisers. You can still close the window before a result is picked.`,
        targetId: 'leu-btn-randompicker',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-btn-randompicker')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: `Gui settings contains settings about app interface, themes and accessibility.`,
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
        message: `If you prefer you can set the app to landscape mode, when enabled you can swap the two players around the screen.`,
        targetId: 'leu-ctn-lsm',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-lsm')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: `You can replace rapid buttons with the calculator (but clicking on LP will no longer open it).`,
        targetId: 'leu-ctn-rbs',
        positionV: 'center',
        positionH: 'center',
        enterEvent: () => {
          document.getElementById('leu-ctn-rbs')?.scrollIntoView({ behavior: 'smooth' });
        },
      },
      {
        message: `But if you prefer using rapid buttons, you can customize their amount depending on your device and preferences.`,
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
        message: `Android settings contains settings specific to your Android device, if applicable.`,
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
        message: `Behaviours settings are some special settings to customize some automation during the match.`,
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
        message: `Each one has an extensive info to it, they can be really useful.`,
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
        message: `And that's it, feel free to rewatch this small guide using the button at the end of the settings page.
      Have fun with leuDuel!`,
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
      this.currentStepIndex.update((index) => index - 1);
      if (this.steps()[this.currentStepIndex()].enterEvent) {
        this.steps()[this.currentStepIndex()].enterEvent?.();
      }
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
    this.settingsModalRef = this.modalService.open(SettingsPageComponent, {
      size: 'full',
      closeEvent: () => {
        this.settingsModalRef = null;
      },
    });
  }

  private closeSettings() {
    if (this.settingsModalRef) {
      this.settingsModalRef.close();
      this.settingsModalRef = null;
    }
  }
}
