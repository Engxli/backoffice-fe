import { Component } from '@angular/core';
import { AppRoutes } from '../../models/AppRoutes';
import { StorageService } from '../../utils/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  homePage = AppRoutes.Dashboard;
  constructor(private router: Router) {}
  logout(): void {
    StorageService.deleteToken();
    this.router.navigate([AppRoutes.Login]);
  }
}
