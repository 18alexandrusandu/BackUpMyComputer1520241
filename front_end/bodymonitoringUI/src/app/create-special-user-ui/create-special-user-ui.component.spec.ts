import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpecialUserUIComponent } from './create-special-user-ui.component';

describe('CreateSpecialUserUIComponent', () => {
  let component: CreateSpecialUserUIComponent;
  let fixture: ComponentFixture<CreateSpecialUserUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSpecialUserUIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSpecialUserUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
