import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNewRequestComponent } from './team-new-request.component';

describe('TeamNewRequestComponent', () => {
  let component: TeamNewRequestComponent;
  let fixture: ComponentFixture<TeamNewRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamNewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
