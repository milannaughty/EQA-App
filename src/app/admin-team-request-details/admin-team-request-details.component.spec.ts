import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTeamRequestDetailsComponent } from './admin-team-request-details.component';

describe('AdminTeamRequestDetailsComponent', () => {
  let component: AdminTeamRequestDetailsComponent;
  let fixture: ComponentFixture<AdminTeamRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTeamRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTeamRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
