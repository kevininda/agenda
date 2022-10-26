import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserI } from 'src/app/shared/interfaces/auth.interface';
import { AuthService } from 'src/app/shared/services/auth.service';

import {DialogsComponent} from './dialogs/dialogs.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {

  private _subs: Subscription[] = [];

  progress: boolean = false;
  dataUserForm!: FormGroup;

  province!: string;
  departament!: string;

  private get _getGeoGroup() { return this.dataUserForm.get('adress')?.get('location')?.get('geo') }

  constructor(
    private readonly _authSVC: AuthService,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog
  ) {
    this.province = '';
    this.departament = '';
  }


  ngOnInit(): void {
    const sub = this._authSVC.user$.subscribe(user => {
      if (user) this._initFormDataUser(user.dataUser);
    });

    this._subs.push(sub);
  }

  ngOnDestroy(): void {
    this._subs.forEach(s => s.unsubscribe());
  }

  private _initFormDataUser(dataUser: UserI['dataUser']): void {
    this.dataUserForm = this._fb.group({
      email: [{ value: dataUser.email, disabled: true }],
      name: [dataUser.name, Validators.required],
      lastname: [dataUser.lastname, Validators.required],
      adress: this._fb.group({
        street: [dataUser.adress?.street],
        num: [dataUser.adress?.num],
        province: this._fb.group({
          nombre: [dataUser.adress?.province.nombre]
        }),
        departament: this._fb.group({
          nombre: [dataUser.adress?.departament.nombre]
        }),
        location: this._fb.group({
          nombre: [dataUser.adress?.province.nombre],
          geo: this._fb.group({
            lat: [dataUser.adress?.location.geo.lat],
            lon: [dataUser.adress?.location.geo.lon]
          })
        })
      })
    });
  }

  getProvince(province: string): void {
    this.province = province;
  }

  getDepartament(departament: string): void {
    this.departament = departament;
  }

  getGeoLocation(geoLocation: string): void {
    const geo: { lat: number, lon: number } = JSON.parse(geoLocation);
    this._getGeoGroup?.setValue(geo);
  }

  //Tabs

  tabs = ['Perfil'];
  selected = new FormControl(0);
  
  addSuc(): void {
    this.tabs.push('Nueva Sucursal');
    this.selected.setValue(this.tabs.length - 1);
  }
  
  removeSuc(idx: number): void {
    const dialogRef = this._dialog.open(DialogsComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.tabs.splice(idx, 1);
    });

  }


  updateUserData(): void {
    console.log(this.dataUserForm.value);
  }

}
