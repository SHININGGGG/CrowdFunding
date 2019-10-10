import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public loggedInMember: any = null;

  readonly USERKEY: string = "USER";

  public projectSearchString: String = "";

  constructor(private http: HttpClient) {
    let loggedInUserJSON = sessionStorage.getItem(this.USERKEY);

    if (loggedInUserJSON) {
      let userObj = JSON.parse(loggedInUserJSON);
      this.login(userObj.username, userObj.hashedpassword).then(
        (result) => {
          console.log(this.loggedInMember);
          if (!result) {
            this.logout();
          }
        }
      )
    }
  }

  async login(username: String, password: String): Promise<Boolean> {
    try {
      let result: any = await this.http.post(
        `${environment.ENDPOINT}/api/user/login`,
        { username: username, hashedpassword: password }
      ).toPromise();


      if (!result || result.length == 0 || result.name == "QueryResultError") {
        return false;
      } else {
        //Save User Info in Session
        this.loggedInMember = result;
        sessionStorage.setItem(this.USERKEY, JSON.stringify(this.loggedInMember))
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  async logout() {
    this.loggedInMember = null;
    sessionStorage.clear();
    return true;
  }

  async getUserPledgeStats(startTime: number, endTime: number) {

    let pledgeConfig = {
      startTime: startTime,
      endTime: endTime
    }

    let options = {
      params: new HttpParams().set("pledgeConfig", JSON.stringify(pledgeConfig))
    }

    return await this.http.get(
      `${environment.ENDPOINT}/api/user/user-stats/${this.loggedInMember.username}/pledge-dist`,
      options
    ).toPromise();
  }

  async getUserProjectDonationStats() {
    let result = await this.http.get(
      `${environment.ENDPOINT}/api/user/user-stats/${this.loggedInMember.username}/project-pledge-dist`
    ).toPromise()

    return result;
  }

  async getUserSubmittedReport() {

    let reports = await this.http.get(
      `${environment.ENDPOINT}/api/report/user/${this.loggedInMember.username}`
    ).toPromise();

    return reports;
  }
}
