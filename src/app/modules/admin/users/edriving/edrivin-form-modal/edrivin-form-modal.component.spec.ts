import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdrivinFormModalComponent } from './edrivin-form-modal.component';

describe('EdrivinFormModalComponent', () => {
  let component: EdrivinFormModalComponent;
  let fixture: ComponentFixture<EdrivinFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdrivinFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdrivinFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
