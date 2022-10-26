import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthError } from 'firebase/auth';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private _sub!: Subscription;

  hide: boolean = true;
  resetView: boolean = false;

  loading: boolean = true;
  progress: boolean = false;

  loginForm!: FormGroup;

  errorMjs: string = '';
  title: string = 'Iniciar sesión';

  public get email() { return this.loginForm.get('email'); }
  private get _password() { return this.loginForm.get('password'); }

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _authSvc: AuthService,
    private readonly _route: Router,
    private readonly _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._sub = this._authSvc.user$.subscribe(user => {
      if(user) {
        if(this._authSvc.isCliente(user)) this._route.navigateByUrl('client');
        else this._route.navigateByUrl('admin');
      }

      setTimeout(() => {
        this.loading = false;
      }, 500);
    })
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  async onSubmit(): Promise<void> {
    this.progress = true;
    try {
      await this._authSvc.login({ email: this.email?.value, password: this._password?.value });
      this.progress = false;
      this._route.navigateByUrl('client');
    } catch (error: any) {
      this.progress = false;
      const err = error as AuthError;
      console.error(err);

      this.errorMjs = this._authSvc.handleErrorCodes(err);
      setTimeout(() => this.errorMjs = '', 5000);

    }
  }

  activeViewReset(): void {
    this.resetView = true;
    this.title = 'Restablecer contraseña'
  }

  async resetPass(): Promise<void> {
    this.progress = true;
    await this._authSvc.resetPassword(this.email?.value);
    this.progress = false;
    this.getBack();
    this.title = 'Iniciar sesión';

    const mjs = 'Se ha enviado un correo, por favor revise su casilla.';
    this._openSnackBar(mjs);
    
  }

  getBack(): void {
    this.resetView = false;
    this.title = 'Iniciar sesión';
  }

  private _openSnackBar(message: string) {
    this._snackBar.open(message, '', { duration: 3000 });
  }

}
