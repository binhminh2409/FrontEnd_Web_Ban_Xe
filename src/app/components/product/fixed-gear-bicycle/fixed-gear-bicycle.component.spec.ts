import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedGearBicycleComponent } from './fixed-gear-bicycle.component';

describe('FixedGearBicycleComponent', () => {
  let component: FixedGearBicycleComponent;
  let fixture: ComponentFixture<FixedGearBicycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedGearBicycleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FixedGearBicycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
