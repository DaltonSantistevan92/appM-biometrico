import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReconocimientoDactilarPage } from './reconocimiento-dactilar.page';

describe('ReconocimientoDactilarPage', () => {
  let component: ReconocimientoDactilarPage;
  let fixture: ComponentFixture<ReconocimientoDactilarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReconocimientoDactilarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
