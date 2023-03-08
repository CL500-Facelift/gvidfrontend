import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";

const routes: Routes = [
  { path: '', loadChildren: () => import('./component/login/login.module').then(m => m.LoginModule)},
  { path: 'homepage', loadChildren: () => import('./component/homepage/homepage.module').then(m => m.HomepageModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
