import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScvComponent } from './upload-scv.component';

describe('UploadScvComponent', () => {
  let component: UploadScvComponent;
  let fixture: ComponentFixture<UploadScvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadScvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadScvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
