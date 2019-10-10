import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../services/project.service';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects: any;

  constructor(private http: HttpClient, public projectService: ProjectService) { }

  async ngOnInit() {
    let projects = await this.projectService.fetchAllProjectByProgress();
    this.projects = projects.map( (project) => {
      project.imagefilename = project.imagefilename ? `${environment.ENDPOINT}/project/img/${project.imagefilename}` : "assets/images/post-bg.jpg"
      return project
    })
  }
}
