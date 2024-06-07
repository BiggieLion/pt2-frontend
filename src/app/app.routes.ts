import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dasboard/dashboard/dashboard.component';
import { AboutComponent } from './about/about/about.component';
import { CreditFormComponent } from './layout/credit_form/credit-form/credit-form.component';
import { SignUpComponent } from './sign-up/sign-up.component'; 

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    },
    {title: "Dasboard", path:'dashboard' , component: DashboardComponent},
    {title: "Dasboard", path:'about' , component: AboutComponent},
    {title: "Dasboard", path:'form' , component: CreditFormComponent},
    {title: "Registro", path:'sign-up' , component: SignUpComponent},
];
