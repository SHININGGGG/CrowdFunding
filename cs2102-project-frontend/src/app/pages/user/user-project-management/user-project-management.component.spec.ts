import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectManagementComponent } from './user-project-management.component';

describe('UserProjectManagementComponent', () => {
  let component: UserProjectManagementComponent;
  let fixture: ComponentFixture<UserProjectManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProjectManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
