import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateNoteComponent } from './create-or-update-note.component';

describe('CreateOrUpdateNoteComponent', () => {
  let component: CreateOrUpdateNoteComponent;
  let fixture: ComponentFixture<CreateOrUpdateNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrUpdateNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
