import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { SellComponent } from './components/sell/sell.component';
import { VehiclePhotosTestComponent } from './components/vehicle-photos/vehicle-photos-test.component';
import { PaymentTestComponent } from './components/payment/payment-test.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vehicles', component: CarListComponent },
  { path: 'vehicle/:id', component: VehicleDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'sell', component: SellComponent, canActivate: [AuthGuard] },
  { path: 'sell-old', component: CarFormComponent, canActivate: [AuthGuard] },
  { path: 'photos', component: VehiclePhotosTestComponent },
  { path: 'payment', component: PaymentTestComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
