import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceMaintenanceComponent } from './maintenance-maintenance.component';

describe('MaintenanceMaintenanceComponent', () => {
  let component: MaintenanceMaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceMaintenanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
