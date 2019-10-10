import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CommonUtilService } from '../../services/common-util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userName: String = ""
  password: String = ""
  confirmPassword: String = ""

  constructor(private commonUtilService: CommonUtilService, public http: HttpClient, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
  }

  async createUser(content) {

    if (!this.verifyRegisterInfo())
      return;

    let newUser = {
      username: this.userName,
      hashedpassword: this.password,
      userrole: "USER"
    }

    try {
      await this.http.post(
        `${environment.ENDPOINT}/api/user`,
        newUser
      ).toPromise();

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      
      //Reset Field
      this.userName = ""
      this.password = ""
      this.confirmPassword = ""

    } catch (e) {
      //Show Error Dialog
      this.commonUtilService.openModal("Username is already taken!")
    }
  }

  verifyRegisterInfo(): Boolean {
    let checkUsername = Boolean(this.userName);
    let checkPassword = Boolean(this.password);
    // let checkConfirmPassword = Boolean(this.confirmPassword);
    if (!checkUsername) {
      this.commonUtilService.openModal("Username cannot be empty");
      return false;
    } else if (!checkPassword) {
      this.commonUtilService.openModal("Password field cannot be empty");
      return false;
    } else if (this.password !== this.confirmPassword) {
      this.commonUtilService.openModal("Passwords do not match!");
      return false;
    }

    return true;
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }
}
