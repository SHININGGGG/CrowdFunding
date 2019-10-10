import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCommentComponent } from './project-comment.component';

describe('ProjectCommentComponent', () => {
  let component: ProjectCommentComponent;
  let fixture: ComponentFixture<ProjectCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
