import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  private canvasNativeElement: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  file: File | null = null;
  imgLoad = false;
  isZoom = false;
  zoomMessage = 'Zoomer';
  enableDrawLine = false;
  paths = [];

  private getFirstPoint = false;
  private mousePos1 = [0, 0];
  private center = {x: 0, y: 0};

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvasNativeElement = this.canvas.nativeElement;
    this.canvasNativeElement.width = 900;
    this.canvasNativeElement.height = 600;
  }

  /** Import the image, clean the canvas in case an image is already here and draw the new image with this new file */
  importImg(files: FileList) {
    this.file = files.item(0);
    this.cleanCanvas();
    this.drawImage();
    this.imgLoad = true;
  }

  enableDraw(): void {
    this.enableDrawLine = !this.enableDrawLine;
  }

  /** Delete all drawing on the canvas by deleting the canvas and reloading the image */
  clickRight(e: MouseEvent) {
    this.cleanCanvas();
    this.drawImage();
    this.getFirstPoint = false;
    this.paths = [];
  }

  /** Function enable when the draw button is click. Get the position of the first point with the first click and call the drawLine function on the second click */
  draw(e: MouseEvent): void {
    if (this.enableDrawLine) {
      const y = e.offsetY;
      const x = e.offsetX;
      if (!this.getFirstPoint) {
        this.mousePos1 = [x, y];
        this.getFirstPoint = true;
      } else {
        const mousePos2 = [x, y];
        this.paths.push({x:this.mousePos1, y:mousePos2});
        this.drawLine(this.mousePos1, mousePos2);
        this.getFirstPoint = false;
      }
    }
  }

  toggleZoom() {
    this.isZoom = !this.isZoom;
    this.cleanCanvas();
    this.drawImage();
    this.zoomMessage = this.isZoom ? 'Dezoomer' : 'Zoomer';
  }

  /** Function to draw a line in the canvas. The line is draw by getting the position of two click of the user */
  private drawLine(mousePos1, mousePos2) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(mousePos1[0] - this.center.x, mousePos1[1] - this.center.y);
      this.ctx.lineTo(mousePos2[0] - this.center.x, mousePos2[1] - this.center.y);
      this.ctx.stroke();
      this.ctx.closePath();
  }

  /** Function to display the image in the canvas and adapt the size of the canvas to the size of the image */
  private drawImage(): void {
    if (this.file) {
      const img = new Image;
      img.onload = () => {
          this.canvasNativeElement.width = img.width;
          this.canvasNativeElement.height = img.height;
          this.center.x = this.isZoom ? img.width / 4 : 0;
          this.center.y = this.isZoom ? img.height / 4 : 0;
          if (this.isZoom) {
            this.ctx.scale(2, 2);
            this.ctx.drawImage(img, this.center.x, this.center.y, img.width, img.height, 0, 0, img.width, img.height);
          } else {
            this.ctx.drawImage(img, 0, 0, img.width, img.height);
          }
          this.paths.forEach(path => {
            this.drawLine(path.x, path.y);
          });

      }
      img.src = URL.createObjectURL(this.file);
    }
  }

  private cleanCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasNativeElement.width, this.canvasNativeElement.height);
  }
}
