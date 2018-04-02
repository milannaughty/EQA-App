import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRequestListComponent } from './team-request-list.component';

describe('TeamRequestListComponent', () => {
  let component: TeamRequestListComponent;
  let fixture: ComponentFixture<TeamRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
