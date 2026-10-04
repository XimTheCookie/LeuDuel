import { Component, AfterViewInit, OnDestroy, viewChild, ElementRef, inject } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

interface Point {
  x: number;
  y: number;
}

interface Chain {
  points: Point[]; // continuous path of points
  angle: number; // current heading
  angularVelocity: number; // how fast heading turns each frame
  totalRotation: number; // accumulated rotation, capped to avoid circles
  speed: number;
  tailBuffer: number;
  opacity: number;
  fadeOpacity: number;
  dying: boolean;
}

@Component({
  selector: 'app-lines-wallpaper',
  templateUrl: './lines-wallpaper.component.html',
  styleUrls: ['./lines-wallpaper.component.scss'],
})
export class LinesWallpaperComponent implements AfterViewInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private ctx!: CanvasRenderingContext2D;
  private chains: Chain[] = [];
  private animationId = 0;

  private readonly CHAIN_COUNT = 18;
  private readonly FADE_SPEED = 0.018;
  private readonly MAX_ROTATION = Math.PI * 0.75;
  private readonly TAIL_INTERVAL = 8;

  private get lineColor(): string {
    switch (this.settingsService.theme()) {
      case 'light':
        return '15, 25, 50,';
      case 'high-contrast':
        return '180, 150, 40,';
      default:
        return '100, 130, 190,';
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.spawnChains();
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
    this.chains = [];
    this.spawnChains();
  };

  private spawnChain(canvas: HTMLCanvasElement, staggerLife = false): Chain {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 1;
    const av = (Math.random() - 0.5) * 0.04;
    const opacity = Math.random() * 0.3 + 0.3;

    const ox = Math.random() * canvas.width;
    const oy = Math.random() * canvas.height;

    const preTravel = staggerLife ? Math.random() * Math.max(canvas.width, canvas.height) * 0.3 : 0;
    const pointCount = staggerLife ? Math.floor(preTravel / speed) + 2 : 2;

    const points: Point[] = [];
    let px = ox,
      py = oy,
      pa = angle;
    for (let i = 0; i < pointCount; i++) {
      points.push({ x: px, y: py });
      px += Math.cos(pa) * speed;
      py += Math.sin(pa) * speed;
      pa += av;
    }

    return {
      points,
      angle: pa,
      angularVelocity: av,
      totalRotation: 0,
      speed,
      tailBuffer: 0,
      opacity,
      fadeOpacity: staggerLife ? opacity : 0,
      dying: false,
    };
  }

  private spawnChains() {
    const canvas = this.canvasRef().nativeElement;
    this.chains = Array.from({ length: this.CHAIN_COUNT }, () => this.spawnChain(canvas, true));
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.update();
    this.draw();
  };

  private update() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;
    const margin = 60;

    for (let i = 0; i < this.chains.length; i++) {
      const c = this.chains[i];

      if (c.dying) {
        c.fadeOpacity -= this.FADE_SPEED;
        if (c.fadeOpacity <= 0) this.chains[i] = this.spawnChain(canvas, false);
        continue;
      }

      if (c.fadeOpacity < c.opacity) {
        c.fadeOpacity = Math.min(c.fadeOpacity + this.FADE_SPEED, c.opacity);
      }

      if (Math.abs(c.totalRotation) < this.MAX_ROTATION) {
        c.angle += c.angularVelocity;
        c.totalRotation += c.angularVelocity;
      }

      const head = c.points[c.points.length - 1];
      c.points.push({
        x: head.x + Math.cos(c.angle) * c.speed,
        y: head.y + Math.sin(c.angle) * c.speed,
      });

      c.tailBuffer++;
      if (c.tailBuffer >= this.TAIL_INTERVAL) {
        c.tailBuffer = 0;
        const tail = c.points[0];
        const backAngle = c.angle + Math.PI + (Math.random() - 0.5) * 0.2;
        c.points.unshift({
          x: tail.x + Math.cos(backAngle) * c.speed * this.TAIL_INTERVAL,
          y: tail.y + Math.sin(backAngle) * c.speed * this.TAIL_INTERVAL,
        });
      }

      const tip = c.points[c.points.length - 1];
      if (tip.x < -margin || tip.x > width + margin || tip.y < -margin || tip.y > height + margin) {
        c.dying = true;
      }
    }
  }

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const { width, height } = canvas;
    const color = this.lineColor;

    this.ctx.clearRect(0, 0, width, height);

    for (const c of this.chains) {
      const pts = c.points;
      if (pts.length < 2) continue;

      const total = pts.length;
      for (let i = 1; i < total; i++) {
        const posRatio = i / total;
        const alpha = c.fadeOpacity * (0.15 + posRatio * 0.85);
        const lineWidth = 0.6 + posRatio * 1.6;

        this.ctx.beginPath();
        this.ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        this.ctx.lineTo(pts[i].x, pts[i].y);
        this.ctx.strokeStyle = `rgba(${color} ${alpha})`;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
      }
    }
  }
}
