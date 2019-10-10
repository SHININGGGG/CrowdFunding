import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-alpha-demo-page',
  templateUrl: './alpha-demo-page.component.html',
  styleUrls: ['./alpha-demo-page.component.scss']
})
export class AlphaDemoPageComponent implements OnInit {

  input_userName: String = "12313";
  input_role: String = "TEst Role"
  input_password: String = "12312";

  constructor(private http: HttpClient) {
  }

  users: any = []

  ngOnInit() {
    this.fetchUsers()
  }

  async fetchUsers() {
    let result = await this.http.get(`${environment.ENDPOINT}/api/user`).toPromise();
    console.log(result);
    this.users = result;
  }

  async addUser() {
    let newUser = {
      userrole: this.input_role,
      username: this.input_userName,
      hashedpassword: this.input_password
    }

    await this.http.post(`${environment.ENDPOINT}/api/user`, newUser).toPromise();
    this.fetchUsers()
  }

  async deleteUser(userName: String) {
    await this.http.delete(`${environment.ENDPOINT}/api/user/${userName}`).toPromise();
    this.fetchUsers()
  }

  async editUser(user: any) {
    await this.http.put(`${environment.ENDPOINT}/api/user/${user.username}`, user).toPromise();
    this.fetchUsers()
  }

}
