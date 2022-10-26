import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthError } from 'firebase/auth';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  hide: boolean = true;
  progress: boolean = false;

  public registerForm!: FormGroup;
  public ROLES: string[] = ['SADMIN', 'ADMIN', 'CLIENTE'];

  private get _email() { return this.registerForm.get('email'); }
  private get _password() { return this.registerForm.get('password'); }
  private get _name() { return this.registerForm.get('name'); }
  private get _lastname() { return this.registerForm.get('lastname'); }
  private get _role() { return this.registerForm.get('role'); }

  error!: string;

  constructor(
    public readonly authSvc: AuthService,
    public readonly location: Location,
    private readonly _fb: FormBuilder,
    private readonly _route: Router
  ) { }

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm(): void {
    this.registerForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['CLIENTE', Validators.required],
    });
  }

  async registerUser(): Promise<void> {
    this.progress = true;
    try {
      await this.authSvc.register(
        { email: this._email?.value, password: this._password?.value },
        { name: this._name?.value, lastname: this._lastname?.value, role: this._role?.value }
      );
      this.progress = false;
      this._route.navigateByUrl('client');
    } catch (e: any) {
      this.progress = false;
      const error: AuthError = e;
      this.error = this.authSvc.handleErrorCodes(error);
    }
  }
}
