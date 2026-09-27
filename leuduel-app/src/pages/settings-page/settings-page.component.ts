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

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  imports: [NumberInputComponent, TimeInputComponent, TextButtonComponent, ListPickerComponent],
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

  readonly keepAwakeOptions = [
    {
      label: 'Allow sleeping',
      value: false,
    },
    {
      label: 'Keep awake (during match)',
      value: true,
    },
  ];

  readonly customPlayersOption = [
    {
      label: "Don't use",
      value: false,
    },
    {
      label: 'Use',
      value: true,
    },
  ];

  readonly themeOptions = [
    {
      label: 'Light',
      value: 'light',
    },
    {
      label: 'Dark',
      value: 'dark',
    },
    {
      label: 'High Contrast',
      value: 'high-contrast',
    },
  ];

  readonly swapPlayerOptions = [
    {
      label: 'Not swapped',
      value: false,
    },
    {
      label: 'Player swapped',
      value: true,
    },
  ];

  readonly orientationOptions = [
    {
      label: 'Potrait',
      value: false,
    },
    {
      label: 'Landscape',
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

  resetRapidButtonsColumns() {
    this.rapidButtonsColumns.setValue(this.settingsService.getRapidButtonsColumns());
  }

  guiPreferencesUnchanged() {
    return (
      this.numberOfRapidButtons.value === this.settingsService.getNumberOfRapidButtons() &&
      this.rapidButtonsColumns.value === this.settingsService.getRapidButtonsColumns() &&
      this.isLandscapeOrientation.value === this.settingsService.landscapeMode() &&
      this.modalOpacity.value === this.settingsService.modalOpacity() &&
      this.theme.value === this.settingsService.theme() &&
      this.swapPlayers.value === this.settingsService.swapPlayers()
    );
  }

  guiPreferencesValid() {
    return (
      this.numberOfRapidButtons.valid &&
      this.rapidButtonsColumns.valid &&
      this.isLandscapeOrientation.valid &&
      this.modalOpacity.valid &&
      this.theme.valid
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
}
