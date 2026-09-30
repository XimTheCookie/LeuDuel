import { Component, AfterViewInit, OnDestroy, viewChild, ElementRef, inject } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedY: number;
  speedX: number;
  life: number;
  maxLife: number;
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
  private particles: Particle[] = [];
  private animationId = 0;
  private time = 0;

  private readonly PARTICLE_COUNT = 200;

  private get flameColors(): string[] {
    if (this.settingsService.theme() === 'light') {
      return ['255, 80, 0,', '255, 140, 0,', '255, 200, 50,'];
    }
    if (this.settingsService.theme() === 'high-contrast') {
      return ['255, 50, 0,', '255, 120, 0,', '255, 255, 100,'];
    }
    return ['200, 40, 0,', '255, 100, 0,', '255, 180, 30,'];
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.generateParticles();
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
    this.generateParticles();
  };

  private spawnParticle(canvas: HTMLCanvasElement): Particle {
    const maxLife = canvas.height / (Math.random() * 1.5 + 0.8);
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 20,
      radius: Math.random() * 6 + 2,
      opacity: Math.random() * 0.5 + 0.4,
      speedY: Math.random() * 1.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.6,
      life: Math.random() * maxLife,
      maxLife,
    };
  }

  private generateParticles() {
    const canvas = this.canvasRef().nativeElement;
    this.particles = Array.from({ length: this.PARTICLE_COUNT }, () => this.spawnParticle(canvas));
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.time += 0.02;
    this.draw();
  };

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;
    const colors = this.flameColors;

    this.ctx.clearRect(0, 0, width, height);

    for (const p of this.particles) {
      p.life += 1;
      p.y -= p.speedY;
      p.x += p.speedX + Math.sin(this.time + p.y * 0.02) * 0.4;

      if (p.life >= p.maxLife) {
        Object.assign(p, this.spawnParticle(canvas));
        continue;
      }

      const progress = p.life / p.maxLife;
      const alpha = p.opacity * (1 - progress);
      const radius = p.radius * (1 - progress * 0.5);

      // pick color based on life progress: red → orange → yellow
      const colorIndex = Math.min(Math.floor(progress * colors.length), colors.length - 1);
      const color = colors[colorIndex];

      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      gradient.addColorStop(0, `rgba(${color} ${alpha})`);
      gradient.addColorStop(1, `rgba(${color} 0)`);

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    }
  }
}
