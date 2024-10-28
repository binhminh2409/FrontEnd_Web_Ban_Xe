import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = []; // Dùng để lưu danh sách nhân viên

  constructor(private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployees(); // Gọi hàm lấy danh sách nhân viên khi khởi tạo
  }

  // Hàm để lấy danh sách nhân viên
  getEmployees(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để xem danh sách nhân viên.');
      this.router.navigate(['/admin-login']);
      return;
    }

    this.employeeService.getEmployees(token).subscribe(
      (res) => {
        if (res.success) {
          this.employees = res.data; // Lưu dữ liệu vào biến employees
        } else {
          alert('Không thể lấy danh sách nhân viên.');
        }
      },
      (error) => {
        console.error(error);
        alert('Có lỗi xảy ra khi lấy danh sách nhân viên.'); // Thông báo lỗi nếu có
      }
    );
  }

  // Hàm để xóa nhân viên
  deleteEmployee(email: string): void {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (!token) {
      alert('Bạn cần đăng nhập để thực hiện thao tác này.');
      this.router.navigate(['/admin-login']);
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
      this.employeeService.deleteEmployee(email, token).subscribe(
        (response) => {
          alert(response.message);
          this.getEmployees(); // Cập nhật danh sách sau khi xóa
        },
        (error) => {
          alert('Xóa nhân viên thất bại: ' + error.error.message);
        }
      );
    }
  }
  navigateToAdminPanel(): void {
    this.router.navigate(['admin-panel']); // Điều hướng đến admin-panel
  }
}
