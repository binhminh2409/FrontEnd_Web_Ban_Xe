import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDropdownVisible: boolean = false;
  isLogin = false;
  userName = '';

  constructor(private loginSrv: LoginService, private auth: AuthService) {}

  ngOnInit(): void {
    this.isLogin = this.auth.isLoggedIn();  // Sử dụng AuthService để kiểm tra trạng thái đăng nhập
    if (this.isLogin) {
      this.userName = this.auth.getUserNameFromToken();  // Lấy tên người dùng từ token
    }
  }

  onLogout() {
    this.loginSrv.logout().subscribe(
      response => {
        console.log('Logout successful:', response);
      },
      error => {
        console.error('Error logging out', error);
      }
    );
  }
}
