import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationsInsightComponent } from './registrations-insight.component';

describe('RegistrationsInsightComponent', () => {
  let component: RegistrationsInsightComponent;
  let fixture: ComponentFixture<RegistrationsInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationsInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationsInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
