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
import { ProductdetailComponent } from './components/productdetail/productdetail.component';
import { SlideComponent } from './components/slide/slide.component';
import { SlideService } from './service/slide.service'; 
import { PriceRangePipe } from './components/product-filter.pipe.ts/product-filter.pipe.ts.component';

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
    ProductdetailComponent,
    SlideComponent,
    PriceRangePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    SlideService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
