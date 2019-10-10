import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-project-comment',
  templateUrl: './project-comment.component.html',
  styleUrls: ['./project-comment.component.scss']
})
export class ProjectCommentComponent implements OnInit {

  @Input() project

  comment = ""
  comments: any = []

  constructor(private http: HttpClient,
    public settings: SettingsService) { }

  ngOnInit() {
    this.fetchComments()
  }

  async postComment() {
    await this.http.post(
      `${environment.ENDPOINT}/api/comment/project/${this.project.id}`,
      {
        comment: this.comment,
        username: this.settings.loggedInMember.username,
        projectid: this.project.id
      }
    ).toPromise();

    this.comment = "";

    this.fetchComments()
  }

  async deleteComment(comment) {

    let options = {
      params: new HttpParams().set("comment", JSON.stringify(comment))
    }

    await this.http.delete(
      `${environment.ENDPOINT}/api/comment`,
      options
    ).toPromise()

    this.fetchComments()
  }

  async fetchComments() {
    this.comments = await this.http.get(
      `${environment.ENDPOINT}/api/comment/project/${this.project.id}`
    ).toPromise()
  }

}
