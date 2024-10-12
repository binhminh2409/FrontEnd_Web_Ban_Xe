export interface UpdateUserDto {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    phone?: string | null;
    dateOfBirth?: string;
    gender?: string;
  }