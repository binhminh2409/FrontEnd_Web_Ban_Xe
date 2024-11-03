import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core'; 
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './components/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SlideComponent } from './components/slide/slide.component';
import { SlideService } from './service/slide.service'; 
import { PriceRangePipe } from './components/product-filter.pipe.ts/product-filter.pipe.ts.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { FormsModule } from '@angular/forms';
import { AddressComponent } from './components/address/address.component';
import { AccessoryComponent } from './components/accessory/accessory.component';
import { RegisterComponent } from './components/register/register.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { AdminPanelComponent } from './Admin/admin-panel/admin-panel.component';
import { EmployeeListComponent } from './Admin/employee-list/employee-list.component';
import { CreateEmployeeComponent } from './Admin/create-employee/create-employee.component';
import { AdminHeaderComponent } from './Admin/admin-header/admin-header.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ConfirmPaymentComponent } from './components/confirm-payment/confirm-payment.component';
import { DeliveryComponent } from './components/delivery/delivery.component';


export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return 'your_token_here';
    },
    allowedDomains: ['example.com'],
    disallowedRoutes: ['example.com/auth/login']
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    ProductComponent,
    CartComponent,
    CheckoutComponent,
    SlideComponent,
    PriceRangePipe,
    ProductDetailComponent,
    MyProfileComponent,
    AboutComponent,
    AddressComponent,
    AccessoryComponent,
    RegisterComponent,
    AdminLoginComponent,
    CreateEmployeeComponent,
    EmployeeListComponent,
    AdminHeaderComponent,
    AdminLoginComponent,
    MyOrdersComponent,
    PaymentComponent,
    ConfirmPaymentComponent,
    DeliveryComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPageScrollCoreModule.forRoot(), // Add NgxPageScrollCoreModule here
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
  ],
  providers: [
    JwtHelperService,
    SlideService,
    PriceRangePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
