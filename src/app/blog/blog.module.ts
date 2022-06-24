import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BlogComponent } from '../blog/blog.component';
import { ArticleCreateComponent } from '../blog/article-create/article-create.component';
import { ArticleListComponent } from '../blog/article-list/article-list.component';

import { AuthGuard } from '../auth/auth-control/auth.guard';
import { MaterialModule } from '../material.module';
import { AuthModule } from '@angular/fire/auth';

const blogRoutes: Routes = [
  {
    path: '',
    component: BlogComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'articles', component: ArticleListComponent },
      { path: 'article-create', component: ArticleCreateComponent },
    ],
  },
];

@NgModule({
  declarations: [
    ArticleCreateComponent,
    ArticleListComponent,
    BlogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(blogRoutes),
    MaterialModule,
    AuthModule,
  ],
  exports: [
    ArticleCreateComponent,
    ArticleListComponent,
    BlogComponent
  ],
  providers: [AuthGuard],
})
export class BlogModule {}
