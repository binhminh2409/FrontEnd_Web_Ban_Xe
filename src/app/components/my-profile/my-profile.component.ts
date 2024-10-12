import { Component, OnInit } from '@angular/core';
import { MyProfile, UserProfileResponse } from '../../models/my-profile'; // Import UserProfileResponse
import { MyProfileService } from '../../service/my-profile.service';
import { UpdateUserDto } from '../../models/UpdateUserDto';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ImageUserResponse } from '../../models/ImageUser';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  myProfile: MyProfile = {
    id: 0,
    name: '',
    email: '',
    address: null,
    city: '',
    phone: null,
    dateOfBirth: null,
    gender: null,
  };
  day: string | null = null;
  month: string | null = null;
  year: string | null = null;
  image?: string;
  environment = environment;

  constructor(private mySv: MyProfileService, private router: Router) { }

  ngOnInit(): void {
    const Id = this.mySv.getUserIdFromToken();
    console.log(Id);
    if (Id) {
      this.getMyProfile(+Id);
      this.loadUserImage(+Id);
    } else {
      console.error('User ID not found in token');
    }
  }

  getMyProfile(id: number): void {
    console.log("ID to fetch profile:", id);

    this.mySv.getMyProfile(+id).subscribe({
      next: (response: UserProfileResponse) => {
        console.log("API response:", response);
        if (response.success) {
          this.myProfile = response.data;
          if (this.myProfile && this.myProfile.dateOfBirth) {
            this.splitDateOfBirth(this.myProfile.dateOfBirth);
          }
          console.log("Dữ liệu người dùng:", this.myProfile);
        } else {
          console.error('Failed to retrieve profile:', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

  splitDateOfBirth(dataOfBirth: string): void {
    const parts = dataOfBirth.split('-');
    if (parts.length === 3) {
      this.day = parts[0];
      this.month = parts[1];
      this.year = parts[2];
    }
  }

  maskPhoneNumber(phone: string | null | undefined): string {
    const validPhone = phone ?? '';
    if (validPhone.length > 7) {
      return '*******' + validPhone.slice(-4);
    }
    return validPhone;
  }

  updateUser(): void {
    if (this.myProfile) {
      const userId = this.mySv.getUserIdFromToken();
      const updateUserDto: UpdateUserDto = {
        name: this.myProfile.name || "null",
        email: this.myProfile.email || "null",
        phone: this.myProfile.phone || "null",
        address: this.myProfile.address || "null",
        gender: this.myProfile.gender !== null ? this.myProfile.gender : "null",
        dateOfBirth: `${this.day}-${this.month}-${this.year}`,
        city: this.myProfile.city || "null"
      };

      this.mySv.updateUser(+userId, updateUserDto).subscribe({
        error: (err) => {
          console.error('Lỗi khi cập nhật:', err);
        }
      });
    }
  }

  navigateToAddress() {
    this.router.navigate(['/user/account/address']);
  }

  loadUserImage(userId: Number): void {
    this.mySv.GetImage(+userId).subscribe({
      next: (imageResponse: ImageUserResponse) => {
        this.image = imageResponse.data.image;
        console.log(`Đường dẫn hình ảnh: ${environment.apiUrl + this.image}`);
      },
      error: (error) => {
        console.error('Có lỗi xảy ra khi lấy hình ảnh:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const userId = +this.mySv.getUserIdFromToken();

      this.mySv.updateImage(userId, file).subscribe({
        next: (response: any) => {
          console.log('Hình ảnh đã được cập nhật thành công:', response);
          this.loadUserImage(userId);
        },
        error: (error: any) => {
          console.error('Có lỗi xảy ra khi cập nhật hình ảnh:', error);
        }
      });
    }
  }
}
