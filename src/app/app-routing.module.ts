import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { ErrorComponent } from './error/error.component';
import { SiteInfoComponent } from './landing/site-info/site-info.component';
import { ContactComponent } from './contact/contact.component';
import { FeedbackComponent } from './contact/feedback/feedback.component';

const appRoutes: Routes = [
  { path: 'home', component: LandingComponent },
  { path: 'site-info', component: SiteInfoComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'error', component: ErrorComponent },
  {
    path: 'auth',
    loadChildren: () =>
    import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'projects',
    loadChildren: () =>
    import('./projects/projects.module').then((m) => m.ProjectsModule),
  },
  {
    path: 'about',
    loadChildren: () =>
    import('./about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'blog',
    loadChildren: () =>
    import('./blog/blog.module').then((m) => m.BlogModule),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'ignore',
      scrollOffset: [0, 55],
      preloadingStrategy: PreloadAllModules
    }),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
