import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PledgeService } from '../../services/pledge.service';
import { SettingsService } from '../../services/settings.service';
import { interval } from 'rxjs';
import * as moment from 'moment';
import { ProjectService } from '../../services/project.service';
import { CommonUtilService } from '../../services/common-util.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  project: any = null;
  projectImageURL: String;

  pledgeAmount: string;
  currentModel: NgbActiveModal;
  currentDate: any;

  timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0
  }

  reportDescription: String = '';

  currentTime = new Date().getTime()
  displayTimeToStart = true
  displayTimeToEnd = false

  constructor(
    private modalService: NgbModal,
    public route: ActivatedRoute,
    public http: HttpClient,
    public pledgeService: PledgeService,
    public projectService: ProjectService,
    public settings: SettingsService,
    private router: Router,
    private commonUtils: CommonUtilService) {
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      let projectId = params.projectId;
      await this.loadProject(projectId);

      // Update Timer every 1s
      interval(1000).subscribe(_ => {
        let duration = this.getTimeLeft()
        this.timeLeft = {
          days: duration.days(),
          hours: duration.hours(),
          minutes: duration.minutes()
        };

        this.displayTimeToEnd = this.project.startdate < this.currentTime && this.project.enddate > this.currentTime
        this.displayTimeToStart = this.project.startdate > this.currentTime
      });
    });
  }

  getTimeLeft() {
    this.currentTime = new Date().getTime()
    //Check if project status
    let duration = moment.duration(0);

    //Pending Stage
    if (this.project.startdate > this.currentTime) {
      duration = moment.duration(this.project.startdate - this.currentTime);
    //Ongoing Stage
    } else if (this.project.enddate > this.currentTime) {
      duration = moment.duration(this.project.enddate - this.currentTime);
    }
    return duration;
  }

  openDialog(type) {
    this.currentModel = this.modalService.open(type);
  }

  async loadProject(projectId: number) {
    this.project = await this.projectService.fetchProject(projectId);
    this.verifyProject();
    this.projectImageURL = this.project.imagefilename ? `${environment.ENDPOINT}/project/img/${this.project.imagefilename}` : "assets/images/post-bg.jpg"
  }

  async makePledge() {

    // if (!this.verifyPledgeAmount())
    //   return;

    let message = await this.pledgeService.createPledge(
      Number.parseFloat(this.pledgeAmount) * 100,
      this.project.id,
      this.settings.loggedInMember.username
    )

    if (message === "") {
      this.commonUtils.openModal("Pledge Successful!")
      this.currentModel.close();
      this.loadProject(this.project.id)
    } else {
      this.commonUtils.openModal(`Pledge Unsuccessful! \nReason: ${message}`);
    }
  }

  verifyProject() {
    this.currentDate = new Date().getTime();

    if (this.project.isbanned) {
      this.project.valid = false;
    } else if (this.project.currentamt >= this.project.targetamount) {
      this.project.valid = false;
    } else if (this.currentDate < this.project.startdate) {
      this.project.valid = false;
    } else if (this.currentDate < this.project.enddate) {
      this.project.valid = true;
    } else {
      this.project.valid = false;
    }
  }

  verifyPledgeAmount(): Boolean {
    let regex1 = /^0\.\d{1,2}$/
    let regex2 = /^\d+(?:\.\d{1,2})?$/

    let check = regex1.test(this.pledgeAmount) || regex2.test(this.pledgeAmount)

    if (!check) {
      this.commonUtils.openModal('Invalid Pledge Amount!');
    }

    return check;
  }

  async makeReport() {

    let report = {
      username: this.settings.loggedInMember.username,
      projectid: this.project.id,
      description: this.reportDescription
    }


    let response: any = await this.http.post(
      `${environment.ENDPOINT}/api/report`,
      report
    ).toPromise();

    if (response.message === "ok") {
      this.commonUtils.openModal('Report Submitted Successfully')
      this.currentModel.close();

      this.reportDescription = ""
    } else {
      this.commonUtils.openModal(`Report Unsuccessful. \nReason: ${response.message}`)
    }

  }

  async viewTagSearch(tagName: String) {
    let searchConfig = {
      searchTerms: [tagName]
    };
    this.router.navigate([`/main/project-list/${JSON.stringify(searchConfig)}`]);
  }
}
