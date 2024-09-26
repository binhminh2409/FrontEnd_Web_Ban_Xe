import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module'; // Nhập biến routes từ app-routing.module

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
