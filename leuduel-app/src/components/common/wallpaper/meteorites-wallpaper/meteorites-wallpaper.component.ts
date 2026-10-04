import { Component, AfterViewInit, OnDestroy, viewChild, ElementRef, inject } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

interface Meteorite {
  x: number;
  y: number;
  length: number; // tail length
  speed: number;
  width: number;
  opacity: number;
  fadeOpacity: number;
  dying: boolean;
}

@Component({
  selector: 'app-meteorites-wallpaper',
  templateUrl: './meteorites-wallpaper.component.html',
  styleUrls: ['./meteorites-wallpaper.component.scss'],
})
export class MeteoritesWallpaperComponent implements AfterViewInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private meteorites: Meteorite[] = [];
  private animationId = 0;

  private readonly ANGLE = Math.PI / 6;
  private readonly DX = -Math.sin(this.ANGLE); // ~-0.5
  private readonly DY = Math.cos(this.ANGLE); // ~0.866
  private readonly COUNT = 22;
  private readonly FADE_SPEED = 0.025;

  private get color(): string {
    switch (this.settingsService.theme()) {
      case 'light':
        return '30, 50, 100,';
      case 'high-contrast':
        return '200, 160, 40,';
      default:
        return '140, 170, 220,';
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.spawnAll();
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
    this.meteorites = [];
    this.spawnAll();
  };

  private spawn(canvas: HTMLCanvasElement, stagger = false): Meteorite {
    const length = Math.random() * 120 + 40;
    const speed = Math.random() * 4 + 2;
    const opacity = Math.random() * 0.35 + 0.25;

    const spawnOnTop = Math.random() < 0.6;
    const x = spawnOnTop ? Math.random() * canvas.width : canvas.width + length;
    const y = spawnOnTop ? -length : Math.random() * canvas.height;

    const travel = stagger ? Math.random() * (canvas.width + canvas.height) * 0.6 : 0;

    return {
      x: x + this.DX * travel,
      y: y + this.DY * travel,
      length,
      speed,
      width: Math.random() * 1.5 + 0.5,
      opacity,
      fadeOpacity: stagger ? opacity : 0,
      dying: false,
    };
  }

  private spawnAll() {
    const canvas = this.canvasRef().nativeElement;
    this.meteorites = Array.from({ length: this.COUNT }, () => this.spawn(canvas, true));
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.update();
    this.draw();
  };

  private update() {
    const canvas = this.canvasRef().nativeElement;
    const margin = 80;

    for (let i = 0; i < this.meteorites.length; i++) {
      const m = this.meteorites[i];

      if (m.dying) {
        m.fadeOpacity -= this.FADE_SPEED;
        if (m.fadeOpacity <= 0) this.meteorites[i] = this.spawn(canvas, false);
        continue;
      }

      if (m.fadeOpacity < m.opacity) {
        m.fadeOpacity = Math.min(m.fadeOpacity + this.FADE_SPEED, m.opacity);
      }

      m.x += this.DX * m.speed;
      m.y += this.DY * m.speed;

      const offscreen = m.x < -margin || m.y > canvas.height + margin;

      if (offscreen) m.dying = true;
    }
  }

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;
    const color = this.color;

    this.ctx.clearRect(0, 0, width, height);

    for (const m of this.meteorites) {
      const tailX = m.x - this.DX * m.length;
      const tailY = m.y - this.DY * m.length;

      const grad = this.ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, `rgba(${color} 0)`);
      grad.addColorStop(0.6, `rgba(${color} ${m.fadeOpacity * 0.4})`);
      grad.addColorStop(1, `rgba(${color} ${m.fadeOpacity})`);

      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(m.x, m.y);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = m.width;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      // bright head dot
      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.width * 0.9, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${color} ${m.fadeOpacity})`;
      this.ctx.fill();
    }
  }
}
