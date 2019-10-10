import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLeaderboardComponent } from './project-leaderboard.component';

describe('ProjectLeaderboardComponent', () => {
  let component: ProjectLeaderboardComponent;
  let fixture: ComponentFixture<ProjectLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
