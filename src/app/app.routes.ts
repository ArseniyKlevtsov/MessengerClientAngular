import { Routes } from '@angular/router';
import { NavigationLayoutComponent } from './shared/layouts/navigation-layout/navigation-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { authGuard } from './shared/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '', component: NavigationLayoutComponent, children: [
            { path: '', redirectTo: '/login', pathMatch: "full" },

            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegistrationComponent }
        ]
    },
    {
        path: 'main', component: MainLayoutComponent, canActivate: [authGuard], canActivateChild: [authGuard]
    }

];