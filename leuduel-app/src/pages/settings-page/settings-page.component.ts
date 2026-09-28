import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NumberInputComponent } from '../../components/common/number-input/number-input.component';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';
import { TimeInputComponent } from '../../components/common/time-input/time-input.component';
import { ListPickerComponent } from '../../components/common/list-picker/list-picker.component';
import { SettingsService } from '../../services/settings/settings.service';
import { ModalService } from '../../services/modal/modal.service';
import { AndroidManagementService } from '../../services/android/android-management.service';
import { SoundboardService } from '../../services/soundboard/soundboard.service';
import { BehaviourSettingsPageComponent } from '../behaviour-settings-page/behaviour-settings-page.component';
import { ProfilesPageComponent } from '../profiles-page/profiles-page.component';
import { TranslatePipe } from '../../pipes/translate/translate.pipe';
import { IconComponent } from '../../components/common/icon/icon.component';

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
  ],
})
export class SettingsPageComponent {
  private readonly soundboardService = inject(SoundboardService);
  private readonly modalService = inject(ModalService);
  private readonly settingsService = inject(SettingsService);
  private readonly androidService = inject(AndroidManagementService);

  readonly isAndroid = this.androidService.isAndroid();
  readonly keepAwakeSupported = signal(false);
  readonly keepAwakeSavedValue = signal(false);

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

  readonly bestOfOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
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
  ];

  constructor() {
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

  keepAwakeUnchanged() {
    return this.keepAwake.value === this.keepAwakeSavedValue();
  }

  saveKeepAwake() {
    this.soundboardService.confirmationSound();
    this.settingsService.setKeepAwake(!!this.keepAwake.value);
    this.keepAwakeSavedValue.set(!!this.keepAwake.value);
  }

  resetTimer() {
    this.duration.setValue(3000000);
  }

  duelSettingsUnchanged() {
    return (
      this.lifePoints.value === this.settingsService.getStartingLifePoints() &&
      this.duration.value === this.settingsService.getDuelDuration() &&
      this.bestOf.value === this.settingsService.getNumberOfGames() &&
      this.showCustomPlayers.value === this.settingsService.showCustomPlayers()
    );
  }

  duelSettingsValid() {
    return (
      this.lifePoints.valid &&
      this.duration.valid &&
      this.bestOf.valid &&
      this.showCustomPlayers.valid
    );
  }

  saveDuelSettings() {
    if (!this.duelSettingsValid() || this.duelSettingsUnchanged()) {
      return;
    }
    this.soundboardService.confirmationSound();
    this.settingsService.setStartingLifePoints(this.lifePoints.value!);
    this.settingsService.setDuelDuration(this.duration.value!);
    this.settingsService.setNumberOfGames(this.bestOf.value!);
    this.settingsService.setCustomPlayers(this.showCustomPlayers.value!);
  }

  resetRapidButtons() {
    this.numberOfRapidButtons.setValue(this.settingsService.getNumberOfRapidButtons());
  }

  guiPreferencesUnchanged() {
    return (
      this.numberOfRapidButtons.value === this.settingsService.getNumberOfRapidButtons() &&
      this.rapidButtonsColumns.value === this.settingsService.getRapidButtonsColumns() &&
      this.isLandscapeOrientation.value === this.settingsService.landscapeMode() &&
      this.modalOpacity.value === this.settingsService.modalOpacity() &&
      this.theme.value === this.settingsService.theme() &&
      this.swapPlayers.value === this.settingsService.swapPlayers() &&
      this.useRapidButtons.value === this.settingsService.useRapidButtons()
    );
  }

  guiPreferencesValid() {
    return (
      this.numberOfRapidButtons.valid &&
      this.rapidButtonsColumns.valid &&
      this.isLandscapeOrientation.valid &&
      this.modalOpacity.valid &&
      this.theme.valid &&
      this.useRapidButtons.valid
    );
  }

  saveGuiPreferences() {
    if (this.guiPreferencesUnchanged() || !this.guiPreferencesValid()) {
      return;
    }
    this.soundboardService.confirmationSound();
    this.settingsService.setNumberOfRapidButtons(this.numberOfRapidButtons.value!);
    this.settingsService.setRapidButtonsColumns(this.rapidButtonsColumns.value!);
    this.settingsService.setLandscapeMode(this.isLandscapeOrientation.value!);
    this.settingsService.setModalOpacity(this.modalOpacity.value!);
    this.settingsService.setTheme(this.theme.value!);
    this.settingsService.setSwapPlayers(!!this.swapPlayers.value);
    this.settingsService.setUseRapidButtons(this.useRapidButtons.value!);
  }

  openBehaviourSettings() {
    this.soundboardService.clickSound();
    this.modalService.open(BehaviourSettingsPageComponent, {
      size: 'md',
      opacity: this.settingsService.getModalOpacity(),
    });
  }

  openProfiles() {
    this.soundboardService.clickSound();
    this.modalService.open(ProfilesPageComponent, {
      size: 'full',
      opacity: this.settingsService.getModalOpacity(),
    });
  }

  openGitHub() {
    window.open('https://github.com/XimTheCookie/LeuDuel', '_blank');
  }

  languageChanged() {
    if (!this.language.valid) return;
    this.settingsService.setLanguage(this.language.value!);
  }
}
