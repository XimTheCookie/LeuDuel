import { Component, computed, Inject, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { APP_VERSION } from '../../app/app.config';
import { ButtonComponent } from '../../components/common/button/button.component';
import { IconComponent } from '../../components/common/icon/icon.component';
import { ListPickerComponent } from '../../components/common/list-picker/list-picker.component';
import { NumberInputComponent } from '../../components/common/number-input/number-input.component';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';
import { TimeInputComponent } from '../../components/common/time-input/time-input.component';
import { TranslatePipe } from '../../pipes/translate/translate.pipe';
import { AndroidManagementService } from '../../services/android/android-management.service';
import { ModalConfig, ModalService } from '../../services/modal/modal.service';
import {
  BEHAVIOURS_CONFIG,
  BehaviourSettingsService,
} from '../../services/settings/behaviour-settings.service';
import { SettingsService } from '../../services/settings/settings.service';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { TranslateService } from '../../services/translate/translate.service';
import { ProfilesPageComponent } from '../profiles-page/profiles-page.component';
import { InfoModalComponent } from '../../components/common/info-modal/info-modal.component';
import {
  MODAL_DATA,
  ModalGenericComponent,
} from '../../components/common/modal-generic/modal-generic.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  imports: [
    NumberInputComponent,
    TimeInputComponent,
    TextButtonComponent,
    ListPickerComponent,
    TranslatePipe,
    IconComponent,
    ButtonComponent,
  ],
})
export class SettingsPageComponent {
  version = APP_VERSION;

  private readonly soundboardService = inject(SoundboardService);
  private readonly modalService = inject(ModalService);
  private readonly settingsService = inject(SettingsService);
  private readonly androidService = inject(AndroidManagementService);

  readonly isAndroid = this.androidService.isAndroid();
  readonly keepAwakeSupported = signal(false);
  readonly keepAwakeSavedValue = signal(false);

  private readonly behaviourSettingsService = inject(BehaviourSettingsService);
  private readonly translateService = inject(TranslateService);

  /** Behaviour configs */
  readonly behaviourConfigs = BEHAVIOURS_CONFIG;

  allConfigKeys = Object.keys(this.behaviourConfigs) as (keyof typeof BEHAVIOURS_CONFIG)[];

  counterReset = new FormControl<number>(this.behaviourSettingsService.counterReset(), {
    nonNullable: true,
  });
  gameReset = new FormControl<number>(this.behaviourSettingsService.gameReset(), {
    nonNullable: true,
  });
  winnerSelect = new FormControl<number>(this.behaviourSettingsService.winnerSelect(), {
    nonNullable: true,
  });
  matchStop = new FormControl<number>(this.behaviourSettingsService.matchStop(), {
    nonNullable: true,
  });
  onStartup = new FormControl<number>(this.behaviourSettingsService.onStartup(), {
    nonNullable: true,
  });

  /** Settings */
  keepAwake = new FormControl<boolean>({ value: false, disabled: true });

  lifePoints = new FormControl<number>(this.settingsService.getStartingLifePoints(), [
    Validators.required,
    Validators.min(1),
    Validators.max(9999999),
  ]);

  isLandscapeOrientation = new FormControl<boolean>(this.settingsService.landscapeMode());

  swapPlayers = new FormControl<boolean>(this.settingsService.swapPlayers());
  swapPlayersDisabled = signal(!this.settingsService.landscapeMode());

  theme = new FormControl<string>(this.settingsService.theme());

  showCustomPlayers = new FormControl<boolean>(this.settingsService.showCustomPlayers());

  landscapeMode = computed(() => this.settingsService.landscapeMode());

  bestOf = new FormControl<number>(this.settingsService.getNumberOfGames(), [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  language = new FormControl<string>(this.settingsService.language(), [Validators.required]);

  modalOpacity = new FormControl<number>(this.settingsService.modalOpacity(), [
    Validators.required,
    Validators.min(6),
    Validators.max(10),
  ]);

  background = new FormControl<number>(this.settingsService.background(), [
    Validators.required,
    Validators.min(0),
    Validators.max(4),
  ]);

  duration = new FormControl<number>(this.settingsService.getDuelDuration(), [
    Validators.required,
    Validators.min(300000),
    Validators.max(86400000),
  ]);

  numberOfRapidButtons = new FormControl<number>(this.settingsService.getNumberOfRapidButtons(), [
    Validators.required,
    Validators.min(1),
    Validators.max(15),
  ]);

  rapidButtonsColumns = new FormControl<number>(this.settingsService.getRapidButtonsColumns(), [
    Validators.required,
    Validators.min(1),
    Validators.max(3),
  ]);

  useRapidButtons = new FormControl<boolean>(this.settingsService.useRapidButtons(), [
    Validators.required,
  ]);

  pickRandomPlayer = new FormControl<boolean>(this.settingsService.pickRandomPlayer(), [
    Validators.required,
  ]);

  readonly pickRandomPlayerOptions = [
    {
      label: 'common.label.no',
      value: false,
    },
    {
      label: 'common.label.yes',
      value: true,
    },
  ];

  readonly keepAwakeOptions = [
    {
      label: 'common.label.no',
      value: false,
    },
    {
      label: 'common.label.yes',
      value: true,
    },
  ];

  readonly customPlayersOption = [
    {
      label: 'common.label.no',
      value: false,
    },
    {
      label: 'common.label.yes',
      value: true,
    },
  ];

  readonly themeOptions = [
    {
      label: 'settings.list-value.theme.light',
      value: 'light',
    },
    {
      label: 'settings.list-value.theme.dark',
      value: 'dark',
    },
    {
      label: 'settings.list-value.theme.high-contrast',
      value: 'high-contrast',
    },
  ];

  readonly swapPlayerOptions = [
    {
      label: 'common.label.no',
      value: false,
    },
    {
      label: 'common.label.yes',
      value: true,
    },
  ];

  readonly backgroundOptions = [
    {
      label: 'settings.list-value.wallpaper.none',
      value: 0,
    },
    {
      label: 'settings.list-value.wallpaper.snow',
      value: 1,
    },
    {
      label: 'settings.list-value.wallpaper.embers',
      value: 2,
    },
    {
      label: 'settings.list-value.wallpaper.lines',
      value: 3,
    },
    {
      label: 'settings.list-value.wallpaper.rain',
      value: 4,
    },
  ];

  readonly numberOfColumnsOptions = [
    {
      label: '1',
      value: 1,
    },
    {
      label: '2',
      value: 2,
    },
    {
      label: '3',
      value: 3,
    },
  ];

  readonly useRbOptions = [
    {
      label: 'settings.list-value.rb-use.use',
      value: true,
    },
    {
      label: 'settings.list-value.rb-use.dont-use',
      value: false,
    },
  ];

  readonly orientationOptions = [
    {
      label: 'settings.list-value.orientation.potrait',
      value: false,
    },
    {
      label: 'settings.list-value.orientation.landscape',
      value: true,
    },
  ];

  readonly bestOfOptions = [1, 3, 5, 7, 9].map((n) => ({
    label: n.toString(),
    value: n,
  }));

  readonly modalOpacityOptions = [10, 9, 8, 7, 6].map((n) => ({
    label: n.toString() + '0%',
    value: n,
  }));

  readonly languageOptions = [
    {
      label: 'English',
      value: 'en_GB',
    },
    {
      label: 'Italiano',
      value: 'it_IT',
    },
    {
      label: 'Español',
      value: 'es_ES',
    },
    {
      label: 'Français',
      value: 'fr_FR',
    },
    {
      label: 'Polski',
      value: 'pl_PL',
    },
    {
      label: 'Deutsch',
      value: 'de_DE',
    },
  ];

  constructor(
    @Inject(MODAL_DATA) private modalData: InstanceType<typeof ModalGenericComponent>['data'],
  ) {
    if (this.isAndroid) {
      this.androidService.isKeepAwakeAllowed().then((supported) => {
        this.keepAwakeSupported.set(supported);
        const saved = supported ? this.settingsService.getKeepAwake() : false;
        this.keepAwakeSavedValue.set(saved);
        if (supported) {
          this.keepAwake.setValue(saved);
          this.keepAwake.enable();
        }
      });
    }

    this.lifePoints.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => this.startingLifePointsChanged());

    this.duration.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => this.duelDurationChanged());

    this.bestOf.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => this.numberOfGamesChanged());

    this.numberOfRapidButtons.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => this.numberOfRapidButtonsChanged());
  }

  screenOrientationUpdated() {
    setTimeout(() => {
      const isLandscape = !!this.isLandscapeOrientation.value;
      this.swapPlayersDisabled.set(!isLandscape);
      if (!isLandscape) {
        this.swapPlayers.setValue(false);
      }
    }, 150);
  }

  screenOrientationChanged() {
    if (!this.isLandscapeOrientation.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setLandscapeMode(this.isLandscapeOrientation.value!);
    this.screenOrientationUpdated();
  }

  saveKeepAwake() {
    if (!this.keepAwake.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setKeepAwake(!!this.keepAwake.value);
    this.keepAwakeSavedValue.set(!!this.keepAwake.value);
  }

  resetTimer() {
    this.duration.setValue(3000000);
  }

  startingLifePointsChanged() {
    if (!this.lifePoints.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setStartingLifePoints(this.lifePoints.value!);
  }

  duelDurationChanged() {
    if (!this.duration.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setDuelDuration(this.duration.value!);
  }

  numberOfGamesChanged() {
    if (!this.bestOf.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setNumberOfGames(this.bestOf.value!);
  }

  pickRandomPlayerChanged() {
    if (!this.pickRandomPlayer.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setPickRandomPlayer(!!this.pickRandomPlayer.value);
  }

  customPlayersChanged() {
    if (!this.showCustomPlayers.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setCustomPlayers(!!this.showCustomPlayers.value);
  }

  resetRapidButtons() {
    this.numberOfRapidButtons.setValue(this.settingsService.getNumberOfRapidButtons());
  }

  numberOfRapidButtonsChanged() {
    if (!this.numberOfRapidButtons.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setNumberOfRapidButtons(this.numberOfRapidButtons.value!);
  }

  rapidButtonsColumnsChanged() {
    if (!this.rapidButtonsColumns.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setRapidButtonsColumns(this.rapidButtonsColumns.value!);
  }

  modalOpacityChanged() {
    if (!this.modalOpacity.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setModalOpacity(this.modalOpacity.value!);
  }

  landscapeModeChanged() {
    if (!this.isLandscapeOrientation.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setLandscapeMode(this.isLandscapeOrientation.value!);
  }

  themeChanged() {
    if (!this.theme.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setTheme(this.theme.value!);
  }

  swapPlayersChanged() {
    if (!this.swapPlayers.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setSwapPlayers(!!this.swapPlayers.value);
  }

  useRapidButtonsChanged() {
    if (!this.useRapidButtons.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setUseRapidButtons(this.useRapidButtons.value!);
  }

  backgroundChanged() {
    if (!this.background.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setBackground(this.background.value!);
  }

  openProfiles() {
    this.soundboardService.clickSound();
    this.modalService.open(ProfilesPageComponent, {
      size: 'full',
    });
  }

  openGitHub() {
    window.open('https://github.com/XimTheCookie/LeuDuel', '_blank');
  }

  openPrivacy() {
    window.open('https://ximthecookie.github.io/LeuDuel/privacy.html', '_blank');
  }

  languageChanged() {
    if (!this.language.valid) return;
    this.soundboardService.clickSound();
    this.settingsService.setLanguage(this.language.value!);
  }

  getOptionConfig(configKey: string) {
    return this.behaviourConfigs[configKey];
  }

  getFormControlForConfig(configKey: string) {
    switch (configKey) {
      case 'counterReset':
        return this.counterReset;
      case 'gameReset':
        return this.gameReset;
      case 'winnerSelect':
        return this.winnerSelect;
      case 'matchStop':
        return this.matchStop;
      case 'onStartup':
        return this.onStartup;
      default:
        throw new Error(`Unknown config key: ${configKey}`);
    }
  }

  settingsChanged() {
    return (
      this.counterReset.value !== this.behaviourSettingsService.counterReset() ||
      this.gameReset.value !== this.behaviourSettingsService.gameReset() ||
      this.winnerSelect.value !== this.behaviourSettingsService.winnerSelect() ||
      this.onStartup.value !== this.behaviourSettingsService.onStartup() ||
      this.matchStop.value !== this.behaviourSettingsService.matchStop()
    );
  }

  settingsValid() {
    return (
      this.counterReset.valid &&
      this.gameReset.valid &&
      this.winnerSelect.valid &&
      this.onStartup.valid &&
      this.matchStop.valid
    );
  }

  confirm() {
    if (!this.settingsChanged() || !this.settingsValid()) return;
    this.soundboardService.confirmationSound();
    this.behaviourSettingsService.counterReset.set(this.counterReset.value);
    this.behaviourSettingsService.gameReset.set(this.gameReset.value);
    this.behaviourSettingsService.winnerSelect.set(this.winnerSelect.value);
    this.behaviourSettingsService.matchStop.set(this.matchStop.value);
    this.behaviourSettingsService.onStartup.set(this.onStartup.value);
  }

  info(helper: string) {
    if (!helper) return;
    this.soundboardService.clickSound();
    this.modalService.open(
      InfoModalComponent,
      {
        size: 'sm',
      },
      { info: this.translateService.translate(helper) },
    );
  }

  startTutorial() {
    const event = this.modalData.config?.custom?.startTutorial;
    if (event) {
      this.modalData.overlayRef.dispose();
      event();
    }
  }
}
