import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {

  constructor(private appService: AppService) {}

}
