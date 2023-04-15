import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RIngresoPage } from './ringreso.page';

describe('RIngresoPage', () => {
  let component: RIngresoPage;
  let fixture: ComponentFixture<RIngresoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RIngresoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
