import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor(public readonly authSvc: AuthService, private readonly _route: Router) { }

  ngOnInit(): void {
  }

  async logOut(): Promise<void> {
    await this.authSvc.logout();
    this._route.navigateByUrl('');
  }

}
