import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StlPreviewComponent } from './stl-preview.component';

describe('StlPreviewComponent', () => {
  let component: StlPreviewComponent;
  let fixture: ComponentFixture<StlPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StlPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StlPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
