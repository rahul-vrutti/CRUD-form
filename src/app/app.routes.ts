import { Routes } from '@angular/router';
import { LoginComponent } from './module/login/login.component';
import { UserComponent } from './module/user/user.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'user', component: UserComponent, canActivate: [authGuard] },
];
