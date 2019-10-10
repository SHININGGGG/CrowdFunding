import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../../services/admin.service';
import { CommonUtilService } from '../../../services/common-util.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  allUsers: any = [];

  selectedUser: any;

  addUserModal: NgbActiveModal

  //Create User
  userName: String = ""
  password: String = ""
  userrole: String = "USER"

  //Search Settings
  userNameSearch: String = ""
  displayRole: String = "ALL"

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private modalService: NgbModal,
    private commonUtilService: CommonUtilService,
    public settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers() {
    this.allUsers = await this.adminService.fetchUsers(this.userNameSearch, this.displayRole);
    console.log(this.allUsers);
  }

  async openModal(modalType) {
    this.addUserModal = this.modalService.open(modalType)
  }

  async createUser() {
    let newUser = {
      username: this.userName,
      hashedpassword: this.password,
      userrole: this.userrole
    }

    if (!this.verifyRegisterInfo())
      return;

    try {
      await this.http.post(
        `${environment.ENDPOINT}/api/user`,
        newUser
      ).toPromise();

      this.addUserModal.close()
      this.commonUtilService.openModal("User created successfully")
      this.resetFields()
      this.fetchUsers()

    } catch (e) {
      //Show Error Dialog
      this.commonUtilService.openModal("Username is already taken!")
    }
  }

  verifyRegisterInfo(): Boolean {
    let checkUsername = Boolean(this.userName);
    let checkPassword = Boolean(this.password);

    if (!checkUsername) {
      this.commonUtilService.openModal("Username cannot be empty");
      return false;
    } else if (!checkPassword) {
      this.commonUtilService.openModal("Password field cannot be empty");
      return false;
    }

    return true;
  }

  private resetFields() {
    this.userName = ""
    this.password = ""
    this.userrole = "USER"
  }

  async saveUser(user) {
    let updatedUser = user

    try {
      await this.http.put(
        `${environment.ENDPOINT}/api/user/${user.username}`,
        updatedUser
      ).toPromise();

      this.commonUtilService.openModal(`User ${user.username} is updated!`)
      this.fetchUsers()

    } catch (e) {
      //Show Error Dialog
      this.commonUtilService.openModal("Username is already taken!")
    }
  }

}
