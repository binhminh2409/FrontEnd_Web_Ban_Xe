import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AncientCupComponent } from './ancient-cup.component';

describe('AncientCupComponent', () => {
  let component: AncientCupComponent;
  let fixture: ComponentFixture<AncientCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AncientCupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AncientCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
