import { Component, OnInit, Input } from '@angular/core';
import { PledgeService } from '../../../services/pledge.service';
import * as moment from 'moment';

@Component({
  selector: 'app-project-stats',
  templateUrl: './project-stats.component.html',
  styleUrls: ['./project-stats.component.scss']
})
export class ProjectStatsComponent implements OnInit {

  endDate: any;
  startDate: any;
  pledges = [];

  pledgeLineChartData = []
  pledgeDistPieData = []

  @Input() project;

  constructor(private pledgeService: PledgeService) {
    this.endDate = moment().startOf('day').toDate();
    this.startDate = moment(this.endDate).add(-7, 'd').toDate();
   }

  ngOnInit() {
    this.fetchPledgeGraph()
    //this.fetchPledges()
  }

  async fetchPledgeGraph() {

    let pledgeDataPoints = await this.pledgeService.fetchCumulativePledgeAmountDateRangeByProjectId(
      this.project.id,
      this.project.startdate,
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
      }];
  }

  // async fetchPledges() {
  //   // Need to include current end day as well
  //   let endDate = new Date(this.endDate.getTime() + (24 * 60 * 60 * 1000));
  //   this.pledges = await this.pledgeService.fetchPledgeByProjectId(this.project.id, this.startDate.getTime(), endDate.getTime());
  // }

  async fetchStats() {
    console.log(`Start Time: ${this.startDate}, End Time: ${this.endDate}`);
    // this.fetchPledges();
    this.fetchPledgeGraph();
  }
}
