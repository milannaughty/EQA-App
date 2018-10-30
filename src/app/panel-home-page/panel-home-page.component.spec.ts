import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHomePageComponent } from './panel-home-page.component';

describe('PanelHomePageComponent', () => {
  let component: PanelHomePageComponent;
  let fixture: ComponentFixture<PanelHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
