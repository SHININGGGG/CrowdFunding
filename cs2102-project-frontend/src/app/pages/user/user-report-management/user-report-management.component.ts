import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { CommonUtilService } from '../../../services/common-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-report-management',
  templateUrl: './user-report-management.component.html',
  styleUrls: ['./user-report-management.component.scss']
})
export class UserReportManagementComponent implements OnInit {

  public reports: any = [];

  public selectedReport: any;

  constructor( 
    public settings: SettingsService,
    public commonUtilService: CommonUtilService,
    public modalService: NgbModal,
    private router: Router) {
  }

  async ngOnInit() {

    while (!this.settings.loggedInMember) {
      //Wait for angular service to be ready
      console.log("wait")
      await this.commonUtilService.sleep(500);
    }

    await this.loadReports();
  }

  async loadReports() {
    this.reports = await this.settings.getUserSubmittedReport();
    console.log(this.reports);
  }

  viewReport(report, modalType) {
    this.selectedReport = report;
    this.modalService.open(modalType);
  }

  viewProject(projectId: number) {
    this.router.navigate([`/main/project/${projectId}`]);
  }

}
