import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPanelDetailComponent } from './team-panel-detail.component';

describe('TeamPanelDetailComponent', () => {
  let component: TeamPanelDetailComponent;
  let fixture: ComponentFixture<TeamPanelDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPanelDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPanelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
