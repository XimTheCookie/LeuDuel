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

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
}

@Component({
  selector: 'app-stars-wallpaper',
  templateUrl: './stars-wallpaper.component.html',
  styleUrls: ['./stars-wallpaper.component.scss'],
})
export class StarsWallpaperComponent implements AfterViewInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private animationId = 0;
  private time = 0;

  private readonly STAR_COUNT = 300;

  private get starColor(): string {
    return this.settingsService.theme() === 'light' ? '30, 42, 74,' : '220, 232, 255,';
  }

  private get accentColor(): string {
    return this.settingsService.theme() === 'high-contrast' ? '255, 224, 102,' : '201, 168, 76,';
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.generateStars();
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
    this.generateStars();
  };

  private generateStars() {
    const canvas = this.canvasRef().nativeElement;
    this.stars = Array.from({ length: this.STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.01;
    this.draw();
  };

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;

    this.ctx.clearRect(0, 0, width, height);

    for (const star of this.stars) {
      star.y += star.speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }

      const twinkle = Math.sin(this.time * 2 + star.twinkleOffset) * 0.3 + 0.7;
      const alpha = star.opacity * twinkle;

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.starColor} ${alpha})`;
      this.ctx.fill();
    }

    // occasional gold/blue accent stars
    for (let i = 0; i < this.stars.length; i += 20) {
      const star = this.stars[i];
      const twinkle = Math.sin(this.time * 1.5 + star.twinkleOffset) * 0.4 + 0.6;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius * 1.4, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.accentColor} ${star.opacity * twinkle})`;
      this.ctx.fill();
    }
  }
}
