import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GloveComponent } from './glove.component';

describe('GloveComponent', () => {
  let component: GloveComponent;
  let fixture: ComponentFixture<GloveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GloveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GloveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
