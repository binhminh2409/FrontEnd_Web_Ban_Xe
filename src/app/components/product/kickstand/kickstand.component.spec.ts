import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KickstandComponent } from './kickstand.component';

describe('KickstandComponent', () => {
  let component: KickstandComponent;
  let fixture: ComponentFixture<KickstandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KickstandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KickstandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
