import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatsManagementComponent } from './user-stats-management.component';

describe('UserStatsManagementComponent', () => {
  let component: UserStatsManagementComponent;
  let fixture: ComponentFixture<UserStatsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserStatsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
