import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../services/admin.service';
import { ProjectService } from '../../../services/project.service';
import { CommonUtilService } from '../../../services/common-util.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent implements OnInit {

  public allProjects: any = [];

  public selectedProjectCopy;
  private selectedProjectModal: NgbActiveModal;

  projectNameSearch = []
  displayType = "ALL"

  constructor(private http: HttpClient,
    public adminService: AdminService,
    private projectService: ProjectService,
    private commonUtilService: CommonUtilService,
    private modalService: NgbModal,
    private router: Router) {
  }

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects() {
    this.allProjects = await this.adminService.fetchProjectBySearchTerms(this.projectNameSearch, this.displayType);
    console.log(this.allProjects)
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

  async banProject(project) {
    let result = await this.adminService.freezeProject(project.id);
    this.commonUtilService.openModal(result ? "Project Banned" : "Failed to Ban Project");

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

  viewProject(projectId: number) {
    this.router.navigate([`/main/project/${projectId}`]);
  }

  public requestAutocompleteItems = (text: string) => {
    return this.http.get<string[]>(`${environment.ENDPOINT}/api/tag/suggestion/${text}`)
  };
}
