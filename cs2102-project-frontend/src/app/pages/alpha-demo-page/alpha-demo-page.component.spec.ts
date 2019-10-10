import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaDemoPageComponent } from './alpha-demo-page.component';

describe('AlphaDemoPageComponent', () => {
  let component: AlphaDemoPageComponent;
  let fixture: ComponentFixture<AlphaDemoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlphaDemoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaDemoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
