import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetSportsBikeComponent } from './street-sports-bike.component';

describe('StreetSportsBikeComponent', () => {
  let component: StreetSportsBikeComponent;
  let fixture: ComponentFixture<StreetSportsBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreetSportsBikeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StreetSportsBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
