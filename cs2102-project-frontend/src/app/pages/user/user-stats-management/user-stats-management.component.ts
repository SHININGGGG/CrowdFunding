import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PledgeService } from '../../../services/pledge.service';
import { SettingsService } from '../../../services/settings.service';
import * as moment from 'moment';
import { CommonUtilService } from '../../../services/common-util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-stats-management',
  templateUrl: './user-stats-management.component.html',
  styleUrls: ['./user-stats-management.component.scss']
})
export class UserStatsManagementComponent implements OnInit  {

  startDate: Date
  endDate: Date

  pledges = [];

  pledgeLineChartData = []
  pledgeDistPieData = []


  constructor(
    private pledgeService: PledgeService,
    private settings: SettingsService,
    private commonUtilService: CommonUtilService,
    private router: Router) {
    this.endDate = moment().startOf('day').toDate();
    this.startDate = moment(this.endDate).add(-3, 'd').toDate();
  }

  async ngOnInit() {
    while (!this.settings.loggedInMember) {
      //Wait for angular service to be ready
      console.log("wait")
      await this.commonUtilService.sleep(500);
    }

    this.fetchStats();
  }

  async fetchStats() {
    console.log(`Start Time: ${this.startDate}, End Time: ${this.endDate}`);
    this.fetchPledges();
    this.fetchPledgeDistribution();
    this.fetchPledgeGraph();
  }

  async fetchPledgeGraph() {

    let pledgeDataPoints = await this.pledgeService.fetchTotalPledgeAmountDateRange(
      this.settings.loggedInMember.username,
      this.startDate.getTime(),
      this.endDate.getTime()
    );

    let datapoints = pledgeDataPoints.map(
      (datapoint) => {
        return {
          name: datapoint.date,
          value: datapoint.amount / 100
        }
      }
    )

    this.pledgeLineChartData = [
      {
        name: "Amount Pledged",
        series: datapoints
      }
    ]

  }

  async fetchPledges() {
    //Need to include current end day as well
    let endDate = new Date(this.endDate.getTime() + (24 * 60 * 60 * 1000));
    this.pledges = await this.pledgeService.fetchPledgesByUserName(this.settings.loggedInMember.username, this.startDate.getTime(), endDate.getTime());
  }

  async fetchPledgeDistribution() {
    let endDate = new Date(this.endDate.getTime() + (24 * 60 * 60 * 1000));
    let pledge_dist: any = await this.settings.getUserPledgeStats(this.startDate.getTime(), endDate.getTime());

    this.pledgeDistPieData =
      pledge_dist.map(
        (pledge_info) => {
          return {
            name: pledge_info.tagname,
            value: pledge_info.sum / 100
          }
        }
      )
  }

  viewProject(projectId: number) {
    this.router.navigate([`/main/project/${projectId}`]);
  }

}
