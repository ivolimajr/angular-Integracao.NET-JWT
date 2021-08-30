import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdrivingComponent } from './edriving.component';

describe('EdrivingComponent', () => {
  let component: EdrivingComponent;
  let fixture: ComponentFixture<EdrivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdrivingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdrivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
