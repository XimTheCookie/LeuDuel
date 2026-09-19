import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundboardService {
  constructor() {}

  playSound(soundFile: string) {
    let audio = new Audio();
    audio.src = soundFile;
    audio.play();
  }
}
