import { Injectable } from '@angular/core';

/* Random Service to generate random numbers without relying on a simple Math.random */
@Injectable({
  providedIn: 'root',
})
export class RandomService {
  randomInt(min: number, max: number): number {
    if (min > max) {
      throw new Error('min must be <= max');
    }

    const range = max - min + 1;
    const maxUint32 = 0x100000000;
    const limit = maxUint32 - (maxUint32 % range);

    const buffer = new Uint32Array(1);

    do {
      crypto.getRandomValues(buffer);
    } while (buffer[0] >= limit);

    return min + (buffer[0] % range);
  }

  roll(sides: number): number {
    return this.randomInt(1, sides);
  }

  coinFlip(): 'heads' | 'tails' {
    return this.randomInt(0, 1) === 0 ? 'heads' : 'tails';
  }
}
