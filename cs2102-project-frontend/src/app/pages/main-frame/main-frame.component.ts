import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtilService } from '../../services/common-util.service';

@Component({
  selector: 'app-main-frame',
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.scss']
})
export class MainFrameComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private commonUtilService: CommonUtilService, public settings: SettingsService, public projectService: ProjectService, public router: Router) { }

  ngOnInit() {
  }

  async handleAuthentication() {
    if(this.settings.loggedInMember) {
      await this.settings.logout();
      this.commonUtilService.openModal("Logout Successful!")
      this.router.navigate(["/"])
    }else{
      this.router.navigate(["/login"])
    }
  }

}
