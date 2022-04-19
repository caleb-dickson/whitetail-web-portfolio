import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyComponent } from './early.component';

describe('EarlyComponent', () => {
  let component: EarlyComponent;
  let fixture: ComponentFixture<EarlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
