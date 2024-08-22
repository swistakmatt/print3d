import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CanvasBoxComponent } from '../../canvas-box/canvas-box.component';

@Component({
  selector: 'app-stl-preview',
  standalone: true,
  imports: [CommonModule, DialogModule, CanvasBoxComponent],
  templateUrl: './stl-preview.component.html',
  styleUrl: './stl-preview.component.scss',
})
export class StlPreviewComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() stlFileUrl: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.visible = false;
    this.stlFileUrl = null;
  }
}
