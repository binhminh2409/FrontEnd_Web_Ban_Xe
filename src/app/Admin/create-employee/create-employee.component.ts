import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  registerMessage: string | null = null; // Thông báo sau khi tạo nhân viên

  apiBase = 'https://localhost:5001/api/Admin'; // Địa chỉ API

  constructor(private http: HttpClient, private router: Router) {
    this.employeeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void { }

  onCreate(): void {
    if (this.employeeForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    this.http.post(`${this.apiBase}/CreateEmployee`, this.employeeForm.value, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe(
      (response: any) => {
        if (response.success) {
          this.registerMessage = 'Tạo nhân viên thành công.';
          this.employeeForm.reset(); // Reset form sau khi thành công
        } else {
          alert('Tạo nhân viên thất bại.');
        }
      },
      (error) => {
        console.error('Error creating employee', error);
        alert('Tạo nhân viên thất bại.');
      }
    );
  }
  navigateToAdminPanel(): void {
    this.router.navigate(['admin-panel']); // Điều hướng đến admin-panel
  }
  onLogout() {
    localStorage.removeItem('token'); // Xóa token khỏi local storage
    this.router.navigate(['/admin-login']); // Chuyển hướng về trang đăng nhập
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
