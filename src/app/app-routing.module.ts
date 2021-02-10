import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home/containers/home/home.page';
import { BookmarksPage } from './pages/bookmarks/containers/bookmarks/bookmarks.page';

const routes: Routes = [
  {path:'home', component: HomePage },
  {path:'bookmarks', component: BookmarksPage },
  {path: 'details', loadChildren: () => import('./pages/details/details.module').then(m => m.DetailsModule)  },
  {path:'**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
