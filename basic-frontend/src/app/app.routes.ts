import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { UserprofilComponent } from './features/userprofil/userprofil.component';
import { RecipeCreateComponent } from './features/recipe-create/recipe-create.component';
import { RecipeViewComponent } from './features/recipe-view/recipe-view.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'userprofil',
    component: UserprofilComponent,
  },
  {
    path: 'recipe-create',
    component: RecipeCreateComponent,
  },
  {
    path: 'recipe-view',
    component: RecipeViewComponent,
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
