import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MountainBikeComponent } from './mountain-bike.component';

describe('MountainBikeComponent', () => {
  let component: MountainBikeComponent;
  let fixture: ComponentFixture<MountainBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MountainBikeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MountainBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
