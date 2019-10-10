import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportManagementComponent } from './user-report-management.component';

describe('UserReportManagementComponent', () => {
  let component: UserReportManagementComponent;
  let fixture: ComponentFixture<UserReportManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReportManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
