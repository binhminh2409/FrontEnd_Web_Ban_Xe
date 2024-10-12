export interface ImageUserResponse {
    success: boolean;
    httpStatusCode: number;
    message: string;
    data: ImageUser;
  }

export interface ImageUser{
    id: number;
    image: string;
}