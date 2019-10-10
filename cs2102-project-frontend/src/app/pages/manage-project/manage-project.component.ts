import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { CommonUtilService } from '../../services/common-util.service';
import * as moment from 'moment';
import { TagService } from '../../services/tag.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.scss']
})
export class ManageProjectComponent implements OnInit {

  startDate: Date
  endDate: Date

  projectName: String
  projectDescription: String
  targetAmount: number

  projectImageName: String

  currentProjectId: number;
  projectTags = []

  afuConfig = {
    uploadAPI: {
      url: `${environment.ENDPOINT}/imageUpload`,
    },
    formatsAllowed: " .jpg",
    theme: "attachPin",
    attachPinText: "Only .jpg images are supported",
    maxSize: ""
  };

  constructor(
    private commonUtilService: CommonUtilService,
    public settings: SettingsService,
    public router: Router,
    public route: ActivatedRoute,
    public projectService: ProjectService,
    private http: HttpClient) {
    this.startDate = moment().startOf('day').toDate();
    this.endDate = moment(this.startDate).add(1, 'd').startOf('day').toDate();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      if (params.projectId) {
        //Fetch Current Project Information
        this.currentProjectId = params.projectId
      }
    })
  }

  verifyTargetAmount(): Boolean {
    let regex1 = /^0\.\d{1,2}$/
    let regex2 = /^\d+(?:\.\d{1,2})?$/

    let check = regex1.test(this.targetAmount.toString()) || regex2.test(this.targetAmount.toString())

    if (!check) {
      this.commonUtilService.openModal('Invalid Pledge Amount!');
    }

    return check;
  }

  async createProject() {
    // console.log(this.projectTags);

    if (!this.verifyProjectInfo())
      return;

    let result = await this.projectService.createProject(
      this.projectName,
      this.projectDescription,
      this.targetAmount * 100,
      this.startDate.getTime(),
      this.endDate.getTime(),
      this.projectTags,
      this.projectImageName
    );

    if (result) {
      this.commonUtilService.openModal("Project Created!");
      this.router.navigate(["/main/homepage"]);
    } else {
      this.commonUtilService.openModal("Project Creation Failed.");
    }

  }

  verifyProjectInfo(): Boolean {
    let checkProjectName = Boolean(this.projectName);
    let checkProjectDescription = Boolean(this.projectDescription);
    let checkTargetAmount = Boolean(this.targetAmount);
    let checkDate = Boolean(this.startDate < this.endDate);
    if (!checkProjectName) {
      this.commonUtilService.openModal("Project Creation Failed. Please fill Project Name!");
      return false;
    } else if (!checkProjectDescription) {
      this.commonUtilService.openModal("Project Creation Failed. Please fill Project Description!");
      return false;
    } else if (!checkTargetAmount) {
      this.commonUtilService.openModal("Project Creation Failed. Please fill Target Amount!");
      return false;
    } else if (!checkDate) {
      this.commonUtilService.openModal("Project Creation Failed. Please make sure Start Date is earlier than or equal to End Date!");
      return false;
    }

    if(!this.verifyTargetAmount()) {
      return false;
    }

    return true;
  }

  validateProjectEntry() {
    return this.endDate >= this.startDate
  }

  public requestAutocompleteItems = (text: string) => {
    return this.http.get<string[]>(`${environment.ENDPOINT}/api/tag/suggestion/${text}`)
  };


  public DocUpload(event) {
    console.log("Received Event");
    let responseJSON = JSON.parse(event.response)

    console.log(`FileName is ${responseJSON.filename}`)
    this.projectImageName = responseJSON.filename
  }

}
