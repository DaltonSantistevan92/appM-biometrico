import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaPage } from './vista.page';

describe('VistaPage', () => {
  let component: VistaPage;
  let fixture: ComponentFixture<VistaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VistaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
