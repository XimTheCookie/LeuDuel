import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  viewChild,
} from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  offset: number;
}

@Component({
  selector: 'app-snow-wallpaper',
  template: `<canvas #canvas></canvas>`,
  styles: `
    canvas {
      width: 100%;
      height: 100%;
    }
  `,
  standalone: true,
})
export class SnowWallpaperComponent implements AfterViewInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private snowflakes: Snowflake[] = [];
  private animationId = 0;
  private time = 0;

  optimize = false;
  private readonly SF_COUNT = this.optimize ? 150 : 300;
  private frameCount = 0;

  private get snowflakeColor(): string {
    return this.settingsService.theme() === 'light' ? '30, 42, 74,' : '220, 232, 255,';
  }

  private get accentColor(): string {
    return this.settingsService.theme() === 'high-contrast' ? '255, 224, 102,' : '201, 168, 76,';
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.generateSnowFlakes();
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
    this.generateSnowFlakes();
  };

  private generateSnowFlakes() {
    const canvas = this.canvasRef().nativeElement;
    this.snowflakes = Array.from({ length: this.SF_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      offset: Math.random() * Math.PI * 2,
    }));
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.frameCount++;
    this.time += 0.01;
    if (this.optimize && this.frameCount % 2 !== 0) return;
    this.draw();
  };

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;

    this.ctx.clearRect(0, 0, width, height);

    for (const snowflake of this.snowflakes) {
      snowflake.y += snowflake.speed;
      if (snowflake.y > height) {
        snowflake.y = 0;
        snowflake.x = Math.random() * width;
      }

      const twinkle = Math.sin(this.time * 2 + snowflake.offset) * 0.3 + 0.7;
      const alpha = snowflake.opacity * twinkle;

      this.ctx.beginPath();
      this.ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.snowflakeColor} ${alpha})`;
      this.ctx.fill();
    }

    for (let i = 0; i < this.snowflakes.length; i += 20) {
      const snowflake = this.snowflakes[i];
      const twinkle = Math.sin(this.time * 1.5 + snowflake.offset) * 0.4 + 0.6;
      this.ctx.beginPath();
      this.ctx.arc(snowflake.x, snowflake.y, snowflake.radius * 1.4, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.accentColor} ${snowflake.opacity * twinkle})`;
      this.ctx.fill();
    }
  }
}
