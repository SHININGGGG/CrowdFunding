import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { SettingsService } from '../../../services/settings.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtilService } from '../../../services/common-util.service';
import { AdminService } from '../../../services/admin.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-project-management',
  templateUrl: './user-project-management.component.html',
  styleUrls: ['./user-project-management.component.scss']
})
export class UserProjectManagementComponent implements OnInit {

  projects: any = [];
  currentTime: number = new Date().getTime()

  //Project Pledge Stats
  pledgeDist = [{
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  }]

  searchTypes = [
    { displayName: "Project Name", systemName: "projectname" },
    { displayName: "Project Tag", systemName: "tag" }
  ]

  searchTerms: any = [];
  selectedSearchType: any = this.searchTypes[0];

  public selectedProjectCopy;
  private selectedProjectModal: NgbActiveModal;

  options = {
    projectname: null,
    createtime: null,
    status: null
  };

  constructor(private projectService: ProjectService,
    private settings: SettingsService,
    private commonUtilService: CommonUtilService,
    private modalService: NgbModal,
    private adminService: AdminService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() {
    this.loadProjects();
  }

  async loadProjects() {
    this.projects = await this.projectService.fetchProjectBySearchTerms([], this.options, this.settings.loggedInMember.username);
    this.getProjectTagDistribution()
  }

  editProject(project, modalType) {
    this.selectedProjectCopy = Object.assign({}, project);
    //Convert Date Objects
    this.selectedProjectCopy.createtimeDate = new Date(Number.parseInt(this.selectedProjectCopy.createtime))
    this.selectedProjectCopy.startdateDate = new Date(Number.parseInt(this.selectedProjectCopy.startdate))
    this.selectedProjectCopy.enddateDate = new Date(Number.parseInt(this.selectedProjectCopy.enddate))
    this.selectedProjectModal = this.modalService.open(modalType, { size: 'lg' });
  }

  async updateProject() {
    let result = await this.projectService.updateProject(
      this.selectedProjectCopy.id,
      this.selectedProjectCopy.projectname,
      this.selectedProjectCopy.projectdescription,
      this.selectedProjectCopy.targetamount,
      this.selectedProjectCopy.startdateDate.getTime(),
      this.selectedProjectCopy.enddateDate.getTime(),
      this.selectedProjectCopy.tags
    );

    if (result) {
      this.commonUtilService.openModal("Project Updated Successfully");
    } else {
      this.commonUtilService.openModal("Project Not Updated Successfully");
    }

    this.selectedProjectCopy = null;
    this.selectedProjectModal.close();
    this.loadProjects();
  }

  async deleteProject(projectId: number) {
    let result = await this.adminService.deleteProject(projectId);
    if (result) {
      this.commonUtilService.openModal("Project Deleted");
    } else {
      this.commonUtilService.openModal("Failed to delete Project");
    }

    this.loadProjects();
  }

  public requestAutocompleteItems = (text: string) => {
    return this.http.get<string[]>(`${environment.ENDPOINT}/api/tag/suggestion/${text}`)
  };

  async getProjectTagDistribution() {
    let datapoints: any = await this.settings.getUserProjectDonationStats()

    this.pledgeDist = datapoints.map((datapoint) => {
      return {
        "name": datapoint.tagname,
        "value": datapoint.sum / 100
      }
    })
  }

  viewProject(projectId: number) {
    this.router.navigate([`/main/project/${projectId}`]);
  }

}
