import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutComponent } from '../about/about.component';
import { MaterialModule } from '../material.module';
import { RouterModule, Routes } from '@angular/router';

const aboutRoutes: Routes = [
  { path: '', component: AboutComponent }
]

@NgModule({
  declarations: [
    AboutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(aboutRoutes),
    MaterialModule,
  ],
  exports: [AboutComponent]
})
export class AboutModule { }
