import { Component, AfterViewInit, OnDestroy, viewChild, ElementRef, inject } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

@Component({
  selector: 'app-aurora-wallpaper',
  template: `<canvas #canvas></canvas>`,
  styles: `
    canvas {
      width: 100%;
      height: 100%;
    }
  `,
  standalone: true,
})
export class AuroraWallpaperComponent implements AfterViewInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);

  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly optimize = (navigator.hardwareConcurrency ?? 4) <= 2;
  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private frameCount = 0;
  private time = 0;

  private get colors(): { rgb: string; bg: string } {
    switch (this.settingsService.theme()) {
      case 'light':
        return {
          bg: '220, 235, 245',
          rgb: '40,150,130|70,120,210|130,90,180|90,160,200|160,100,160',
        };
      case 'high-contrast':
        return {
          bg: '10, 10, 10',
          rgb: '255,220,70|255,160,20|255,245,150|200,240,80|255,200,50',
        };
      default:
        return {
          bg: '8, 12, 28',
          rgb: '30,210,160|70,120,255|170,70,240|40,180,220|130,60,255',
        };
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
  };

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.frameCount++;
    if (this.optimize && this.frameCount % 2 !== 0) return;
    this.time += 0.008;
    this.draw();
  };

  private draw() {
    const { width, height } = this.canvasRef().nativeElement;
    const { bg, rgb } = this.colors;
    const allBands = rgb.split('|');
    const bands = this.optimize ? allBands.slice(0, 3) : allBands;

    this.ctx.fillStyle = `rgb(${bg})`;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.shadowBlur = this.optimize ? 0 : 40;

    const step = Math.max(40, width / 20);
    for (let band = 0; band < bands.length; band++) {
      const color = bands[band];
      const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `rgba(${color}, 0)`);
      gradient.addColorStop(0.25, `rgba(${color}, 0.18)`);
      gradient.addColorStop(0.5, `rgba(${color}, 0.32)`);
      gradient.addColorStop(0.75, `rgba(${color}, 0.18)`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);

      const points: [number, number][] = [];
      for (let x = 0; x <= width + step; x += step) {
        const y =
          height * (0.3 + band * 0.1) +
          Math.sin(x * 0.004 + this.time + band * 1.7) * height * 0.1 +
          Math.sin(x * 0.009 - this.time * 0.6 + band) * height * 0.04 +
          (!this.optimize ? Math.sin(x * 0.002 + this.time * 0.3 + band * 0.5) * height * 0.025 : 0);
        points.push([x, y]);
      }

      this.ctx.beginPath();
      this.ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length - 1; i++) {
        const mx = (points[i][0] + points[i + 1][0]) / 2;
        const my = (points[i][1] + points[i + 1][1]) / 2;
        this.ctx.quadraticCurveTo(points[i][0], points[i][1], mx, my);
      }

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = Math.max(60, height * 0.14);
      this.ctx.shadowColor = `rgba(${color}, 0.5)`;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }
}
