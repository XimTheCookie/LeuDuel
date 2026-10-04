import { Component, AfterViewInit, OnDestroy, viewChild, ElementRef, inject } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

interface Ember {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedY: number;
  drift: number;
  driftOffset: number;
  life: number;
  maxLife: number;
  colorIndex: number;
}

@Component({
  selector: 'app-flames-wallpaper',
  templateUrl: './flames-wallpaper.component.html',
  styleUrls: ['./flames-wallpaper.component.scss'],
})
export class FlamesWallpaperComponent implements AfterViewInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private embers: Ember[] = [];
  private animationId = 0;
  private time = 0;

  private readonly EMBER_COUNT = 160;

  private get emberColors(): string[] {
    if (this.settingsService.theme() === 'light') {
      return ['255, 120, 20,', '255, 170, 40,', '255, 210, 80,', '255, 240, 140,'];
    }
    if (this.settingsService.theme() === 'high-contrast') {
      return ['255, 60, 0,', '255, 130, 10,', '255, 200, 50,', '255, 255, 120,'];
    }
    return ['180, 40, 0,', '220, 80, 10,', '255, 140, 20,', '255, 200, 80,'];
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.generateEmbers();
    this.animate();
    window.addEventListener('resize', this.resize);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
  }

  private resize = () => {
    const canvas = this.canvasRef().nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.generateEmbers();
  };

  private spawnEmber(canvas: HTMLCanvasElement, randomLife = false): Ember {
    const maxLife = canvas.height / (Math.random() * 0.6 + 0.3);
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 10,
      radius: Math.random() * 2.2 + 0.8,
      opacity: Math.random() * 0.5 + 0.5,
      speedY: Math.random() * 0.8 + 0.4,
      drift: (Math.random() - 0.5) * 0.015,
      driftOffset: Math.random() * Math.PI * 2,
      life: randomLife ? Math.random() * maxLife : 0,
      maxLife,
      colorIndex: Math.floor(Math.random() * 4),
    };
  }

  private generateEmbers() {
    const canvas = this.canvasRef().nativeElement;
    this.embers = Array.from({ length: this.EMBER_COUNT }, () => this.spawnEmber(canvas, true));
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.02;
    this.draw();
  };

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;
    const colors = this.emberColors;

    this.ctx.clearRect(0, 0, width, height);

    for (const e of this.embers) {
      e.life += 1;
      e.y -= e.speedY;
      e.x += Math.sin(this.time * 0.8 + e.driftOffset + e.y * 0.01) * 0.5 + e.drift;

      if (e.life >= e.maxLife || e.y < -10) {
        Object.assign(e, this.spawnEmber(canvas));
        continue;
      }

      const progress = e.life / e.maxLife;
      const fadeIn = Math.min(progress * 8, 1);
      const fadeOut = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;
      const alpha = e.opacity * fadeIn * fadeOut;

      const color = colors[e.colorIndex];
      const r = e.radius;

      const glow = this.ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r * 3);
      glow.addColorStop(0, `rgba(${color} ${alpha * 0.35})`);
      glow.addColorStop(1, `rgba(${color} 0)`);
      this.ctx.beginPath();
      this.ctx.arc(e.x, e.y, r * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = glow;
      this.ctx.fill();

      const core = this.ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
      core.addColorStop(0, `rgba(255, 240, 200, ${alpha})`);
      core.addColorStop(0.4, `rgba(${color} ${alpha * 0.9})`);
      core.addColorStop(1, `rgba(${color} 0)`);
      this.ctx.beginPath();
      this.ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
      this.ctx.fillStyle = core;
      this.ctx.fill();
    }
  }
}
