import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../../services/admin.service';
import { SettingsService } from '../../../services/settings.service';
import { CommonUtilService } from '../../../services/common-util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.scss']
})

export class ReportManagementComponent implements OnInit {

  public allReports: any = [];

  public selectedReport: any;
  public reportModal: NgbActiveModal;

  projectSearchTerm: String = ""
  displayType: String = "ALL"

  constructor(
    public adminService: AdminService,
    private modalService: NgbModal,
    private settings: SettingsService,
    private commonUtilService: CommonUtilService,
    private router: Router) {
  }

  async ngOnInit() {
    this.fetchReports()
  }

  viewReport(report, modalType) {
    this.selectedReport = report;
    this.reportModal = this.modalService.open(modalType);
  }

  async bannProject(project) {
    let result = await this.adminService.freezeProject(project.projectid);
    this.commonUtilService.openModal(result ? "Project Banned" : "Failed to Banned Project");
  }

  async updateReportComment(report) {
    this.adminService.updateReportComment(report.projectid, report.username, report.handledescription);
  }

  async markReportAsResolved(report) {
    report.handler = this.settings.loggedInMember.username;

    await this.adminService.markReportAsHandled(report.projectid, report.username, report.handler);
    this.reportModal.close();

    await this.fetchReports()
  }

  viewProject(projectId: number) {
    this.router.navigate([`/main/project/${projectId}`]);
  }

  async fetchReports() {
    this.allReports = await this.adminService.fetchReports(this.projectSearchTerm, this.displayType);
    console.log(this.allReports)
  }

}
