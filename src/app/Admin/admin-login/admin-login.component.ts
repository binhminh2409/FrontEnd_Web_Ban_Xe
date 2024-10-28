import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminLoginService } from '../../service/admin-login.service'; 
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  loginMessage: string | null = null; // Lưu thông báo đăng nhập
  helper = new JwtHelperService(); // Dùng để decode token

  constructor(private loginSrv: AdminLoginService,
    private router: Router
  ) { }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.loginSrv.login(this.loginForm.value).subscribe(
      (res: string) => {
        console.log('Login successful:', res);

        // Chuyển đổi chuỗi văn bản thành JSON
        const parsedRes = JSON.parse(res);
        localStorage.setItem('token', parsedRes.data); // Lưu token vào localStorage

        const decodedToken = this.helper.decodeToken(parsedRes.data); // Decode token để kiểm tra role
        console.log('Decoded Token:', decodedToken);

        if (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'ManagerMent') {
          this.router.navigate(['/admin-panel']); // Điều hướng đến Admin Panel nếu là admin
        } else {
          alert('Tài khoản không có quyền truy cập vào Admin Panel.');
          localStorage.removeItem('token'); // Xóa token nếu không đủ quyền
        }
      },
      (error: any) => {
        console.error(error);
        const errorMessage = error.error?.message || 'Email hoặc mật khẩu không đúng.';
        alert(errorMessage);
        localStorage.removeItem('token'); // Xóa token nếu đăng nhập thất bại
      }
    );
  }
}
