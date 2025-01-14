import { Routes } from '@angular/router';
import { NavigationLayoutComponent } from './shared/layouts/navigation-layout/navigation-layout.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path: '', component: NavigationLayoutComponent, children: [
            { path: '', redirectTo: '/login', pathMatch: "full" },
            { path: 'login', component: LoginComponent },
        ]
    },
];