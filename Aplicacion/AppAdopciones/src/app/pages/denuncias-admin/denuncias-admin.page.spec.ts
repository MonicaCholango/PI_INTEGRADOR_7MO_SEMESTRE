import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DenunciasAdminPage } from './denuncias-admin.page';

describe('DenunciasAdminPage', () => {
  let component: DenunciasAdminPage;
  let fixture: ComponentFixture<DenunciasAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DenunciasAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
