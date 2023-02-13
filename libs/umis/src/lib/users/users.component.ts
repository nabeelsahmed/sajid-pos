import { Component, OnInit, ViewChild } from '@angular/core';
import { MyFormField, UserCreationInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { UserTableComponent } from './user-table/user-table.component';
declare var $: any;

@Component({
  selector: 'aims-pos-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @ViewChild(UserTableComponent) userTable: any;

  txtSearch: any = '';
  txtConfirmPw: any = '';
  lblUserCount: any = 0;
  hide = true;
  hidecp = true;

  pageFields: UserCreationInterface = {
    userID: '0', //0
    spType: '', //1
    empName: '', //2
    loginName: '', //3
    Password: '', //4
    outletid: '0', //5
    roleId: '0', //6
    userTypeID: '0', //7
    dateOfBirth: '', //8
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.spType,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.empName,
      msg: 'enter full name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.loginName,
      msg: 'enter email',
      type: 'email',
      required: true,
    },
    {
      value: this.pageFields.Password,
      msg: 'enter password',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.outletid,
      msg: 'select outlet',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.roleId,
      msg: 'select role',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.userTypeID,
      msg: 'select userTypeID',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.dateOfBirth,
      msg: '',
      type: 'datePicker',
      required: false,
    },
  ];

  outletList: any = [];
  roleList: any = [];

  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('User Creation');

    this.getRoles();
    this.getOutlet();
    this.getUser();
  }

  getUser() {
    this.dataService.getHttp('user-api/User/getUser', '').subscribe(
      (response: any) => {
        this.userTable.tableData = response;
        this.lblUserCount = response.length;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getOutlet() {
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe(
      (response: any) => {
        this.outletList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRoles() {
    this.dataService.getHttp('user-api/Role/getRoles', '').subscribe(
      (response: any) => {
        this.roleList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save() {
    this.formFields[7].value = '1';
    this.formFields[8].value = new Date();

    if (this.formFields[4].value.length < 8) {
      this.valid.apiInfoResponse('password length is less than 8');
      return;
    }
    if (this.txtConfirmPw == '') {
      this.valid.apiInfoResponse('enter confirm password');
      return;
    }
    if (this.formFields[4].value != this.txtConfirmPw) {
      this.valid.apiInfoResponse('password not matched');
      return;
    }
    if (this.formFields[0].value == 0) {
      this.dataService
        .savetHttp(this.pageFields, this.formFields, 'user-api/User/saveUser')
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.message == 'Success') {
              this.valid.apiInfoResponse('User created successfully');
              this.getUser();
              this.reset();
            } else {
              this.valid.apiErrorResponse(response[0]);
            }
          },
          (error: any) => {
            this.error = error;
            this.valid.apiErrorResponse(this.error);
          }
        );
    } else {
      this.dataService
        .savetHttp(this.pageFields, this.formFields, 'user-api/User/updateUser')
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.message == 'Success') {
              this.valid.apiInfoResponse('User updated successfully');
              this.getUser();
              this.reset();
            } else {
              this.valid.apiErrorResponse(response[0]);
            }
          },
          (error: any) => {
            this.error = error;
            this.valid.apiErrorResponse(this.error);
          }
        );
    }
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
    this.txtConfirmPw = '';
  }

  edit(item: any) {
    $('#userModal').modal('show');
    this.formFields[0].value = item.userID;
    this.formFields[2].value = item.empName;
    this.formFields[3].value = item.loginName;
    this.formFields[5].value = item.outletid;
    this.formFields[6].value = item.roleId;
  }

  delete(item: any) {
    this.reset();

    setTimeout(() => this.getUser(), 200);
  }
}
