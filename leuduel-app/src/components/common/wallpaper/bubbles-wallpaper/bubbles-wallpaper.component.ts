import { Component, AfterViewInit, OnDestroy, viewChild, ElementRef, inject } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  opacity: number;
  phase: number;
}

@Component({
  selector: 'app-bubbles-wallpaper',
  template: `<canvas #canvas></canvas>`,
  styles: `
    canvas {
      width: 100%;
      height: 100%;
    }
  `,
  standalone: true,
})
export class BubblesWallpaperComponent implements AfterViewInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly optimize = (navigator.hardwareConcurrency ?? 4) <= 2;
  private ctx!: CanvasRenderingContext2D;
  private bubbles: Bubble[] = [];
  private animationId = 0;
  private time = 0;
  private readonly BUBBLE_COUNT = this.optimize ? 16 : 36;

  private get color(): string {
    switch (this.settingsService.theme()) {
      case 'light':
        return '35, 65, 115,';
      case 'high-contrast':
        return '220, 175, 35,';
      default:
        return '145, 190, 245,';
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
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
    this.bubbles = Array.from({ length: this.BUBBLE_COUNT }, () => this.spawnBubble(canvas, true));
  };

  private spawnBubble(canvas: HTMLCanvasElement, randomHeight = false): Bubble {
    return {
      x: Math.random() * canvas.width,
      y: randomHeight ? Math.random() * canvas.height : canvas.height + Math.random() * 40,
      radius: Math.random() * 12 + 3,
      speed: Math.random() * 0.45 + 0.2,
      drift: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.22 + 0.12,
      phase: Math.random() * Math.PI * 2,
    };
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.015;
    this.draw();
  };

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;
    const color = this.color;
    this.ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this.bubbles.length; i++) {
      const bubble = this.bubbles[i];
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(this.time + bubble.phase) * bubble.drift * 0.15;
      if (bubble.y < -bubble.radius * 2) {
        this.bubbles[i] = this.spawnBubble(canvas);
        continue;
      }

      const alpha = bubble.opacity * (0.8 + Math.sin(this.time * 2 + bubble.phase) * 0.2);
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${color} ${alpha * 0.18})`;
      this.ctx.fill();
      this.ctx.strokeStyle = `rgba(${color} ${alpha})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(
        bubble.x - bubble.radius * 0.3,
        bubble.y - bubble.radius * 0.3,
        Math.max(1, bubble.radius * 0.12),
        0,
        Math.PI * 2,
      );
      this.ctx.fillStyle = `rgba(${color} ${alpha * 0.8})`;
      this.ctx.fill();
    }
  }
}
