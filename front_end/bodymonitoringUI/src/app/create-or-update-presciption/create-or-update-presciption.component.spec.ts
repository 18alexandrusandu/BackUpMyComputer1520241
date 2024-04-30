import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdatePresciptionComponent } from './create-or-update-presciption.component';

describe('CreateOrUpdatePresciptionComponent', () => {
  let component: CreateOrUpdatePresciptionComponent;
  let fixture: ComponentFixture<CreateOrUpdatePresciptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrUpdatePresciptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdatePresciptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
