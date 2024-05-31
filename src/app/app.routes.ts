import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/Auth/welcome/welcome.component';
import { authGuard } from './auth.guard';

import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  {
    path: '**',
    component: HomeComponent,
  },
];
