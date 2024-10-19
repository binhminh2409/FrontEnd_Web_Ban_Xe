import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { AddressComponent } from './components/address/address.component';
import { AccessoryComponent } from './components/accessory/accessory.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path:'about',component: AboutComponent},
    { path: 'login',component: LoginComponent},
    { path: 'product',component: ProductComponent},
    { path: 'cart',component: CartComponent},
    { path: 'checkout', component: CheckoutComponent},
    { path: 'productdetail/:productName/:productId', component: ProductDetailComponent },
    { path: 'my-profile', component: MyProfileComponent},
    { path: 'user/account/address', component: AddressComponent },
    { path: 'accessory', component: AccessoryComponent},
    { path: 'register', component: RegisterComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

export { routes }; // Xuất biến routes
