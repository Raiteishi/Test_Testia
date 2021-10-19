import { Component, ViewChild, ElementRef, ngAfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements ngAfterViewInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  private canvasNativeElement: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  file: File | null = null;
  imgLoad = false;
  isZoom = false;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvasNativeElement = this.canvas.nativeElement;
    this.canvasNativeElement.width = 900;
    this.canvasNativeElement.height = 600;
  }

  importImg(files: FileList) {
    this.file = files.item(0);
    this.cleanCanvas();
    this.drawImage();
    this.imgLoad = true;
  }

  draw() {

  }

  toggleZoom() {
    this.isZoom = !this.isZoom;
  }

  private drawImage(): void {
    if (this.file) {
      const img = new Image;
      img.onload = () => {
          this.canvasNativeElement.width = img.width;
          this.canvasNativeElement.height = img.height;
          this.ctx.drawImage(img, 0, 0, img.width, img.height);
      }
      img.src = URL.createObjectURL(this.file);
    }
  }

  private cleanCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasNativeElement.width, this.canvasNativeElement.height);
  }
}
