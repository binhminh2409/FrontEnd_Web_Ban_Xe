import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheSubjectComponent } from './the-subject.component';

describe('TheSubjectComponent', () => {
  let component: TheSubjectComponent;
  let fixture: ComponentFixture<TheSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheSubjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TheSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
