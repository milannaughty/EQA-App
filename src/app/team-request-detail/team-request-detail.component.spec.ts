import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRequestDetailComponent } from './team-request-detail.component';

describe('TeamRequestDetailComponent', () => {
  let component: TeamRequestDetailComponent;
  let fixture: ComponentFixture<TeamRequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamRequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
