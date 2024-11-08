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
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { AdminPanelComponent } from './Admin/admin-panel/admin-panel.component';
import { EmployeeListComponent } from './Admin/employee-list/employee-list.component';
import { CreateEmployeeComponent } from './Admin/create-employee/create-employee.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ConfirmPaymentComponent } from './components/confirm-payment/confirm-payment.component';
import { StreetSportsBikeComponent } from './components/product/street-sports-bike/street-sports-bike.component';
import { MountainBikeComponent } from './components/product/mountain-bike/mountain-bike.component';
import { RacingBikeComponent } from './components/product/racing-bike/racing-bike.component';
import { FoldingBikeComponent } from './components/product/folding-bike/folding-bike.component';
import { WomensBicycleComponent } from './components/product/womens-bicycle/womens-bicycle.component';
import { FrameComponent } from './components/product/frame/frame.component';
import { FixedGearBicycleComponent } from './components/product/fixed-gear-bicycle/fixed-gear-bicycle.component';
import { ShirtComponent } from './components/product/shirt/shirt.component';
import { BackpackComponent } from './components/product/backpack/backpack.component';
import { GloveComponent } from './components/product/glove/glove.component';
import { ShoeComponent } from './components/product/shoe/shoe.component';
import { GlassesComponent } from './components/product/glasses/glasses.component';
import { MudguardFenderComponent } from './components/product/mudguard-fender/mudguard-fender.component';
import { KickstandComponent } from './components/product/kickstand/kickstand.component';
import { LampComponent } from './components/product/lamp/lamp.component';
import { WirewrapHandleComponent } from './components/product/wirewrap-handle/wirewrap-handle.component';
import { PedalComponent } from './components/product/pedal/pedal.component';
import { WheelsRimsComponent } from './components/product/wheels-rims/wheels-rims.component';
import { AncientCupComponent } from './components/product/ancient-cup/ancient-cup.component';
import { TheSubjectComponent } from './components/product/the-subject/the-subject.component';
import { HealthCareComponent } from './components/product/health-care/health-care.component';
import { ClockComponent } from './components/product/clock/clock.component';
import { MaintenanceMaintenanceComponent } from './components/maintenance-maintenance/maintenance-maintenance.component';

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
    { path: 'register', component: RegisterComponent},
    { path: 'admin-login', component: AdminLoginComponent},
    { path: 'admin-panel', component: AdminPanelComponent},
    { path: 'employees', component: EmployeeListComponent},
    { path: 'employees/create', component: CreateEmployeeComponent},
    { path: 'my-orders', component: MyOrdersComponent},
    { path: 'payment/:orderId', component: PaymentComponent },
    { path: 'payment/:orderId/confirmed', component: ConfirmPaymentComponent },
    { path: 'street-sports-bike', component: StreetSportsBikeComponent},
    { path: 'mountain-bike', component: MountainBikeComponent},
    { path: 'racing-bike', component: RacingBikeComponent},
    { path: 'folding-bike', component: FoldingBikeComponent},
    { path: 'womens-bicycle', component: WomensBicycleComponent},
    { path: 'frame', component: FrameComponent},
    { path: 'fixed-gear-bicycle', component: FixedGearBicycleComponent},
    { path: 'shirt', component: ShirtComponent},
    { path: 'backpack', component: BackpackComponent},
    { path: 'glove', component: GloveComponent},
    { path: 'shoe', component: ShoeComponent},
    { path: 'glasses', component: GlassesComponent},
    { path: 'mudguard-fender', component: MudguardFenderComponent},
    { path: 'kickstand', component: KickstandComponent},
    { path: 'lamp', component: LampComponent},
    { path: 'wire-wrap-handle', component: WirewrapHandleComponent},
    { path: 'pedal', component: PedalComponent},
    { path: 'wheels-rims', component: WheelsRimsComponent},
    { path: 'ancient-cup', component: AncientCupComponent},
    { path: 'the-subject', component: TheSubjectComponent},
    { path: 'health-care', component: HealthCareComponent},
    { path: 'clock', component: ClockComponent},
    { path: 'maintenance-maintenance', component: MaintenanceMaintenanceComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

export { routes }; // Xuất biến routes
