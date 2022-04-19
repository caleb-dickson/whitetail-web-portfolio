import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';

import { ProjectsComponent } from '../projects/projects.component';
import { EarlyComponent } from '../projects/early/early.component';
import { IntermediateComponent } from '../projects/intermediate/intermediate.component';
import { FrameworksComponent } from '../projects/frameworks/frameworks.component';
import { RouterModule, Routes } from '@angular/router';

const projectsRoutes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      { path: 'early', component: EarlyComponent },
      { path: 'intermediate', component: IntermediateComponent },
      { path: 'frameworks', component: FrameworksComponent },
    ],
  },
];

@NgModule({
  declarations: [
    ProjectsComponent,
    EarlyComponent,
    IntermediateComponent,
    FrameworksComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(projectsRoutes),
  ],
  exports: [
    ProjectsComponent,
    EarlyComponent,
    IntermediateComponent,
    FrameworksComponent,
  ]
})
export class ProjectsModule {}
