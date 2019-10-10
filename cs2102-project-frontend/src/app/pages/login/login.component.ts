import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { SettingsService } from '../../services/settings.service';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtilService } from '../../services/common-util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: String = ""
  password: String = ""

  currentModel: NgbActiveModal;

  constructor(private modalService: NgbModal,
              private commonUtilService: CommonUtilService,
              private http: HttpClient,
              public settings: SettingsService,
              public router: Router) { }

  ngOnInit() {
  }

  openDialog(type){
    this.currentModel = this.modalService.open(type);
  }

  async login() {

    if (!this.verifyUserInfo())
      return;

    let isLoggedIn = await this.settings.login(this.userName, this.password);
    if(isLoggedIn) {
      this.router.navigate(["/main/homepage"])
    } else {
      this.commonUtilService.openModal("Username and Password do not match!");
    }
  }

  verifyUserInfo() : Boolean {
    let checkUsername = Boolean(this.userName);
    let checkPassword = Boolean(this.password);
    if (!checkUsername) {
      this.commonUtilService.openModal("Username cannot be empty!");
      return false;
    } else if (!checkPassword) {
      this.commonUtilService.openModal("Password cannot be empty!");
      return false;
    }

    return true
  }
}
