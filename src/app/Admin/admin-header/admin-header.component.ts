import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent {
  constructor(private router: Router) { }

  navigateToAdminPanel() {
    this.router.navigate(['/admin-panel']); // Điều hướng về trang admin panel
  }

  onLogout() {
    localStorage.removeItem('token'); // Xóa token khỏi local storage
    this.router.navigate(['/admin-login']); // Chuyển hướng về trang đăng nhập
  }

}
