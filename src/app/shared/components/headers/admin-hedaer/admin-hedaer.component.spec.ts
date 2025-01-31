import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHedaerComponent } from './admin-hedaer.component';

describe('AdminHedaerComponent', () => {
  let component: AdminHedaerComponent;
  let fixture: ComponentFixture<AdminHedaerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHedaerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHedaerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
