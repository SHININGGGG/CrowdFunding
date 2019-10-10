import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private settings: SettingsService) { }

  async fetchProjectBySearchTerms(projectNames: String[], displayOptions?: any, userName?: String, status?: String) {

    let options = {
      params: new HttpParams().set('names', JSON.stringify(projectNames))
    }

    options = this.attachProjectOptions(displayOptions, options);

    if (userName) {
      options.params = options.params.set('username', `${userName}`);
    }

    if(status) {
      options.params = options.params.set("status", `${status}`)
    }

    let projects: any = await this.http.get(
      `${environment.ENDPOINT}/api/project/name`,
      options
    ).toPromise();

    //Attach Tags
    for (let i = 0; i < projects.length; i++) {
      let currentProject: any = projects[i];

      let tags = await this.fetchProjectTags(currentProject.id);
      currentProject.tags = tags;
    }

    return projects;
  }

  async fetchProjectByTags(tags: String[], displayOptions?: any, userName?: String, status?: String) {

    let options = {
      params: new HttpParams().set('tags', JSON.stringify(tags))
    }

    options = this.attachProjectOptions(displayOptions, options);

    if (userName) {
      options.params = options.params.set('username', `${userName}`);
    }

    if(status) {
      options.params = options.params.set("status", `${status}`)
    }

    let projects = await this.http.get<{}[]>(
      `${environment.ENDPOINT}/api/project/tag`,
      options
    ).toPromise()

    //Attach Tags
    for (let i = 0; i < projects.length; i++) {
      let currentProject: any = projects[i];

      let tags = await this.fetchProjectTags(currentProject.id);
      currentProject.tags = tags;
    }

    return projects;
  }

  async fetchAllProjectByProgress() {
    let projects = await this.http.get<any>(
      `${environment.ENDPOINT}/api/project/progress`
    ).toPromise();

    for (let project of projects) {
      project.progress = Math.floor((project.progress) * 100);
    }

    return projects;
  }

  async fetchProject(projectId: number) {
    let project = await this.http.get<any>(
      `${environment.ENDPOINT}/api/project/id/${projectId}`
    ).toPromise();

    // Calculate Percentage
    project.pledgeprogress = Math.floor((project.currentamt / project.targetamount) * 100);

    // Fetch Tag
    project.tags = await this.fetchProjectTags(projectId);

    return project;
  }

  async fetchLeaderBoard() {
    let leaderboard = await this.http.get(`${environment.ENDPOINT}/api/project/leaderboard`).toPromise();

    return leaderboard;
  }

  private attachProjectOptions(displayOptions, options?) {

    if (!options)
      options = {
        params: new HttpParams()
      };

    if (displayOptions) {
      options.params = options.params.set("displayOptions", JSON.stringify(displayOptions));
    }

    return options;
  }

  private async fetchProjectTags(projectId: number) {
    let tags = await this.http.get<any>(`${environment.ENDPOINT}/api/tag/project/${projectId}`)
      .toPromise();

    //Keep only tagName
    tags = tags.map(tag => tag.tagname);

    return tags;
  }

  async createProject(projectName: String, projectDescription: String, targetAmount: number, startDate: number, endDate: number, tags: String[], projectImageName: String) {
    let newProject = {
      projectname: projectName,
      projectdescription: projectDescription,
      targetamount: targetAmount,
      projectowner: this.settings.loggedInMember.username,
      startdate: startDate,
      enddate: endDate,
      projectimagename: projectImageName,
      tags: tags
    };

    try {
      await this.http.post(
        `${environment.ENDPOINT}/api/project`,
        newProject
      ).toPromise();

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async updateProject(projectId: number, projectName: String, projectDescription: String, targetAmount: number, startDate: number, endDate: number, tags: String[]) {
    let updatedProjectDetails = {
      projectname: projectName,
      projectdescription: projectDescription,
      targetamount: targetAmount,
      startdate: startDate,
      enddate: endDate,
      tags: tags
    };

    try {
      await this.http.put(
        `${environment.ENDPOINT}/api/project/${projectId}`,
        updatedProjectDetails
      ).toPromise();

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
