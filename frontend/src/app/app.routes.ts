import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Register } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ExpensesComponent } from './pages/expenses/expenses';
import { ProfileComponent } from './pages/profile/profile';
import { LayoutComponent } from './layout/main-layout/main-layout';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  // Protected routes with layout
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },

  // Wildcard
  { path: '**', redirectTo: 'login' }

];