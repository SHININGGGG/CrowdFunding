import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public http: HttpClient) {
  }

  async fetchReports(projectName: String, isResolved?: String): Promise<any[]> {
    try {

      let options = {
        params: new HttpParams().set('name', `${projectName}`)
      }

      if(isResolved || isResolved !== "ALL") {
        options.params = options.params.set("isResolved", `${isResolved}`)
      }
  
      let result = await this.http.get<any[]>(
        `${environment.ENDPOINT}/api/admin`,
        options
      ).toPromise();

      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async freezeProject(projectId: number): Promise<Boolean> {
    try {
      await this.http.post(
        `${environment.ENDPOINT}/api/admin/freeze`,
        { projectid: projectId }
      ).toPromise();

    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  async markReportAsHandled(projectId: number, userName: string, handler: string) {
    try {
      await this.http.post(
        `${environment.ENDPOINT}/api/admin/report/handle`,
        {
          projectid: projectId,
          username: userName,
          handlername: handler
        }
      ).toPromise();

      return true;
    } catch (e) {
      return false;
    }
  }

  async updateReportComment(projectId: number, userName: string, handleDescription: string) {
    try {
      await this.http.post(
        `${environment.ENDPOINT}/api/admin/report/comment`,
        {
          projectid: projectId,
          username: userName,
          handledescription: handleDescription
        }
      ).toPromise();

      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteProject(projectId: number) {
    try {
      await this.http.delete(
        `${environment.ENDPOINT}/api/admin/project/${projectId}`,
      ).toPromise();
      return true;
    } catch (e) {
      return false;
    }
  }

  async fetchUsers(searchTerm: String, display: String) {
    let options = {
      params: new HttpParams().set('searchname', `${searchTerm}`).set('display', `${display}`)
    }

    let users = await this.http.get(
      `${environment.ENDPOINT}/api/user/search`,
      options
    ).toPromise()

    return users;
  }

  async fetchProjectBySearchTerms(projectNames: String[], status?: String) {

    let options = {
      params: new HttpParams().set('names', JSON.stringify(projectNames))
    }

    if(status) {
      options.params = options.params.set("status", `${status}`)
    }

    let projects: any = await this.http.get(
      `${environment.ENDPOINT}/api/admin/project/name`,
      options
    ).toPromise();

    return projects;
  }
}
