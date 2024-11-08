import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomensBicycleComponent } from './womens-bicycle.component';

describe('WomensBicycleComponent', () => {
  let component: WomensBicycleComponent;
  let fixture: ComponentFixture<WomensBicycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WomensBicycleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WomensBicycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
