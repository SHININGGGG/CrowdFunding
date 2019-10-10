import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  constructor(public projectService: ProjectService, public router: Router, private route: ActivatedRoute) { }

  projects: any = [];

  searchTypes = [
    { displayName: "Project Name", systemName: "projectname" },
    { displayName: "Project Tag", systemName: "tag" }
  ]

  searchTerms: any = [];
  selectedSearchType: any = this.searchTypes[0]

  options = {
    projectname: null,
    createtime: null,
    status: null
  };

  displayType = "ALL"

  ngOnInit() {
    this.route.params.subscribe(params => {
      
      if(params.searchConfig) {
        let searchConfig = JSON.parse(params.searchConfig);
        this.searchTerms = searchConfig.searchTerms;
        this.selectedSearchType = this.searchTypes[1]; //Selected Tag
      }

      this.loadProjects();
    })
  }

  async loadProjects() {
    if(this.selectedSearchType.systemName === "projectname") {
      this.searchProjectByNames();
    }else{
      this.searchProjectByTags();
    }
  }

  async searchProjectByNames() {
    this.projects = await this.projectService.fetchProjectBySearchTerms(this.searchTerms, this.options, undefined, status=this.displayType);
  }

  async searchProjectByTags() {
    this.projects = await this.projectService.fetchProjectByTags(this.searchTerms, this.options, undefined, status=this.displayType);
  }

  viewProject(projectId: number) {
    this.router.navigate([`/main/project/${projectId}`]);
  }

  //Rotation Order: null --> true --> false
  public changeSort(category) {
    let initialState = this.options[category];

    //Clear all existing state
    for (var property in this.options) {
      if (this.options.hasOwnProperty(property)) {
        this.options[property] = null;
      }
    }

    if (initialState === false) {
      this.options[category] = null
    } else {
      this.options[category] = !initialState;
    }

    this.loadProjects();
  }

}
