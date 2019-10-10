import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PledgeService {

  constructor(public http: HttpClient) { }

  async createPledge(amount: number, projectId: number, userName: String): Promise<String> {
    try {
      let response: any = await this.http.post(
        `${environment.ENDPOINT}/api/pledge`,
        { amount: amount, projectid: projectId, username: userName }
      ).toPromise();

      if(response.message === "ok") {
        return ""
      } else {
        return response.message
      }

    } catch (e) {
      console.log(e);
    }

    return "error";
  }

  async fetchPledgesByUserName(userName: String, startTime: number, endTime: number): Promise<any[]> {
    try {

      let pledgeConfig = {
        startTime: startTime,
        endTime: endTime
      }

      let options = {
        params: new HttpParams().set("pledgeConfig", JSON.stringify(pledgeConfig))
      }

      let result = await this.http.get<any[]>(
        `${environment.ENDPOINT}/api/pledge/user/${userName}`,
        options
      ).toPromise();

      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async fetchPledgeByProjectId(projectId: number, startTime: number, endTime: number): Promise<any[]> {
    try {

      let pledgeConfig = {
        startTime: startTime,
        endTime: endTime
      }

      let options = {
        params: new HttpParams().set("pledgeConfig", JSON.stringify(pledgeConfig))
      }

      let result = await this.http.get<any[]>(
        `${environment.ENDPOINT}/api/pledge/project/${projectId}`,
        options
      ).toPromise();

      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  // fetch pledge by username
  async fetchTotalPledgeAmountDateRange(userName: String, startTime: number, endTime: number) {
    let result = [];

    let startDate = moment(new Date(startTime));
    let endDate = moment(new Date(endTime));

    //Find Range
    let dateRange = [];
    let dateCounter = moment(startDate);
    while (dateCounter.isSameOrBefore(endDate)) {
      dateRange.push(moment(dateCounter));
      dateCounter.add(1, 'd');
    }

    for (let i = 0; i < dateRange.length; i++) {
      let date = dateRange[i];
      let amount = await this.fetchTotalPledgeAmountByDay(userName, date.valueOf());
      let dateTag = date.format('MMM DD');

      result.push({
        date: dateTag,
        amount: amount
      });
    }

    return result;
  }

  private async fetchTotalPledgeAmountByDay(userName: String, time: number) {
    let startTime = moment(new Date(time));
    let endTime = moment(startTime).add(1, 'd');

    try {

      let pledgeTimeRange = {
        startTime: startTime.valueOf(),
        endTime: endTime.valueOf()
      }

      let options = {
        params: new HttpParams().set("pledgeTimeRange", JSON.stringify(pledgeTimeRange))
      }

      let result = await this.http.get<any>(
        `${environment.ENDPOINT}/api/user/user-stats/${userName}/pledge-graph`,
        options
      ).toPromise();

      return result.amount;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  // fetch cumulative pledge by projectId from a start time to a target time for each day in the window
  async fetchCumulativePledgeAmountDateRangeByProjectId(projectId: number, startTime:number, windowStart: number, windowEnd: number) {
    let result = [];

    let startDate = moment(new Date(windowStart));
    let endDate = moment(new Date(windowEnd));

    //Find Range
    let dateRange = [];
    let dateCounter = moment(startDate);
    while (dateCounter.isSameOrBefore(endDate)) {
      dateRange.push(moment(dateCounter));
      dateCounter.add(1, 'd');
    }

    for (let i = 0; i < dateRange.length; i++) {
      let date = dateRange[i];
      let amount = await this.fetchCumulativePledgeAmountByProjectId(projectId, startTime, moment(date).endOf('day').valueOf());
      let dateTag = date.format('MMM DD');

      result.push({
        date: dateTag,
        amount: amount
      });
    }

    return result;
  }

  private async fetchCumulativePledgeAmountByProjectId(projectId: number, startTime: number, targetTime: number) {

    try {
      let pledgeTimeRange = {
        startTime: startTime.valueOf(),
        endTime: targetTime.valueOf()
      }

      let options = {
        params: new HttpParams().set("pledgeTimeRange", JSON.stringify(pledgeTimeRange))
      }

      let result = await this.http.get<any>(
        `${environment.ENDPOINT}/api/pledge/project-stats/${projectId}/pledge-graph`,
        options
      ).toPromise();

      return result.amount;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  async getPledgeLeaderBoard() {
    let result = await this.http.get(
      `${environment.ENDPOINT}/api/user/leaderboard`
    ).toPromise();

    return result;
  }

  async getPledgeLeaderBoardByProject(projectId: number) {
    let result = await this.http.get(
      `${environment.ENDPOINT}/api/pledge/leaderboard/${projectId}`
    ).toPromise();

    return result;
  }
}
