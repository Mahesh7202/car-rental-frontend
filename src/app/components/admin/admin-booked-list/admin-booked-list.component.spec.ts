import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookedListComponent } from './admin-booked-list.component';

describe('AdminBookedListComponent', () => {
  let component: AdminBookedListComponent;
  let fixture: ComponentFixture<AdminBookedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBookedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBookedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
