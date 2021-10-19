import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('canvasId', {static: false}) myCanvas: ElementRef;

  isZoom = false;


  importImg() {

  }

  draw() {

  }

  toggleZoom() {
    this.isZoom = !this.isZoom;
  }
}
