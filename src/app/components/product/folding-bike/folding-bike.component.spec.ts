import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldingBikeComponent } from './folding-bike.component';

describe('FoldingBikeComponent', () => {
  let component: FoldingBikeComponent;
  let fixture: ComponentFixture<FoldingBikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoldingBikeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoldingBikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
