import { DefaultLayoutComponent } from './core/layouts/default-layout/default-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { HomeComponent } from './views/public/home/home.component';
import { LoginComponent } from './views/public/auth/login/login.component';
import { AppLayoutComponent } from './core/layouts/app-layout/app-layout.component';
import { RegisterComponent } from './views/public/auth/register/register.component';
import { MenuComponent } from './views/menu/menu.component';


const routes: Routes = [
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      }
    ]
  },
  {
    path: 'admin',
    component: AppLayoutComponent,
    canActivate: [AngularFireAuthGuard],
    loadChildren: () => import('./views/private/private-routing.module').then(m => m.PrivateRoutingModule)
  },
  { path: "**", redirectTo: "/home" },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
