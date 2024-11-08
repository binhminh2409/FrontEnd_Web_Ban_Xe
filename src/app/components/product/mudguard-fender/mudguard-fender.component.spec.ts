import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MudguardFenderComponent } from './mudguard-fender.component';

describe('MudguardFenderComponent', () => {
  let component: MudguardFenderComponent;
  let fixture: ComponentFixture<MudguardFenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MudguardFenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MudguardFenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
