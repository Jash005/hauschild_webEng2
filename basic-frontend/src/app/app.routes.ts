import {Routes} from '@angular/router';
import {WelcomeComponent} from './features/welcome/welcome.component';
import {PageNotFoundComponent} from './features/page-not-found/page-not-found.component';
//NOTE - Hier Import von neuen Routen hinzufügen
import {RegisterComponent} from './features/register/register.component';
import {LoginComponent} from './features/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  //NOTE - Hier neue Routen hinzufügen
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
