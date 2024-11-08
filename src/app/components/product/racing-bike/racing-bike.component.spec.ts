import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingBikeComponent } from './racing-bike.component';

describe('RacingBikeComponent', () => {
  let component: RacingBikeComponent;
  let fixture: ComponentFixture<RacingBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacingBikeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RacingBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
