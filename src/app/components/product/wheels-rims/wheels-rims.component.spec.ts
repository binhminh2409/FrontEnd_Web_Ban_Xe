import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelsRimsComponent } from './wheels-rims.component';

describe('WheelsRimsComponent', () => {
  let component: WheelsRimsComponent;
  let fixture: ComponentFixture<WheelsRimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelsRimsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelsRimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
