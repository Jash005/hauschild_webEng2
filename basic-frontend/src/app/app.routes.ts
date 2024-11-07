import {Routes} from '@angular/router';
import {WelcomeComponent} from './features/welcome/welcome.component';
import {PageNotFoundComponent} from './features/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
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
