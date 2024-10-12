export interface MyProfile {
    id: number;
    name: string;
    email: string;
    address: string | null;
    city: string;
    phone: string | null;
    dateOfBirth: string | null;
    gender: string | null;
}

export interface UserProfileResponse {
    success: boolean;
    httpStatusCode: number;
    message: string;
    data: MyProfile;
    totalCount: number;
  }
  