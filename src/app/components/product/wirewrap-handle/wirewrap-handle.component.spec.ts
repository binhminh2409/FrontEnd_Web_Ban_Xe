import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WirewrapHandleComponent } from './wirewrap-handle.component';

describe('WirewrapHandleComponent', () => {
  let component: WirewrapHandleComponent;
  let fixture: ComponentFixture<WirewrapHandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WirewrapHandleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WirewrapHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
