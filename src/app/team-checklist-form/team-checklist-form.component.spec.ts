import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamChecklistFormComponent } from './team-checklist-form.component';

describe('TeamChecklistFormComponent', () => {
  let component: TeamChecklistFormComponent;
  let fixture: ComponentFixture<TeamChecklistFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamChecklistFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamChecklistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
