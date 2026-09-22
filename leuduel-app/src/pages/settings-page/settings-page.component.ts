import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NumberInputComponent } from '../../components/common/number-input/number-input.component';
import { TextButtonComponent } from '../../components/common/text-button/text-button.component';
import { TimeInputComponent } from '../../components/common/time-input/time-input.component';
import { SettingsService } from '../../services/settings.service';
import { ModalService } from '../../services/modal.service';
import { AboutComponent } from '../../components/core/about/about.component';
import { AndroidManagementService } from '../../services/android-management.service';
import { SoundboardService } from '../../services/soundboard.service';
import { BehaviourSettingsPageComponent } from '../behaviour-settings-page/behaviour-settings-page.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  imports: [NumberInputComponent, TimeInputComponent, TextButtonComponent],
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

  isLandscapeOrientation = new FormControl<boolean>(this.settingsService.landscapeMode());

  landscapeMode = computed(() => this.settingsService.landscapeMode());

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

  keepAwakeUnchanged() {
    return this.keepAwake.value === this.keepAwakeSavedValue();
  }

  saveKeepAwake() {
    this.soundboardService.confirmationSound();
    this.settingsService.setKeepAwake(!!this.keepAwake.value);
    this.keepAwakeSavedValue.set(!!this.keepAwake.value);
  }

  lifePoints = new FormControl<number>(this.settingsService.getStartingLifePoints(), [
    Validators.required,
    Validators.min(1),
    Validators.max(9999999),
  ]);

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

  lpReset() {
    this.lifePoints.setValue(this.settingsService.getStartingLifePoints());
  }

  resetBestOf() {
    this.bestOf.setValue(this.settingsService.getNumberOfGames());
  }

  resetOpacity() {
    this.modalOpacity.setValue(this.settingsService.modalOpacity());
  }

  resetTimer() {
    this.duration.setValue(this.settingsService.getDuelDuration());
  }

  duelSettingsUnchanged() {
    return (
      this.lifePoints.value === this.settingsService.getStartingLifePoints() &&
      this.duration.value === this.settingsService.getDuelDuration() &&
      this.bestOf.value === this.settingsService.getNumberOfGames()
    );
  }

  duelSettingsValid() {
    return this.lifePoints.valid && this.duration.valid && this.bestOf.valid;
  }

  saveDuelSettings() {
    if (!this.duelSettingsValid() || this.duelSettingsUnchanged()) {
      return;
    }
    this.soundboardService.confirmationSound();
    this.settingsService.setStartingLifePoints(this.lifePoints.value!);
    this.settingsService.setDuelDuration(this.duration.value!);
    this.settingsService.setNumberOfGames(this.bestOf.value!);
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
      this.modalOpacity.value === this.settingsService.modalOpacity()
    );
  }

  guiPreferencesValid() {
    return (
      this.numberOfRapidButtons.valid &&
      this.rapidButtonsColumns.valid &&
      this.isLandscapeOrientation.valid &&
      this.modalOpacity.valid
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
  }

  viewAboutModal() {
    this.modalService.open(AboutComponent, {
      opacity: this.settingsService.getModalOpacity(),
      size: 'sm',
    });
  }

  openBehaviourSettings() {
    this.modalService.open(BehaviourSettingsPageComponent, {
      size: 'md',
      opacity: this.settingsService.getModalOpacity(),
    });
  }
}
