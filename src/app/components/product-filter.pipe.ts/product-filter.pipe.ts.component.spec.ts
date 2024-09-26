import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterPipeTsComponent } from './product-filter.pipe.ts.component';

describe('ProductFilterPipeTsComponent', () => {
  let component: ProductFilterPipeTsComponent;
  let fixture: ComponentFixture<ProductFilterPipeTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterPipeTsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductFilterPipeTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
