import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServicesAuthModule } from '@aims-pos/shared/services/auth';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import {
  ApplicationModuleInterface,
  DeliveryInterface,
  MyFormField,
  UserInterface,
} from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';

@Component({
  selector: 'aims-pos-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss'],
})
export class TopnavComponent implements OnInit {
  @Output() public drawerToggle = new EventEmitter();

  applicationModulesList: ApplicationModuleInterface[] = [];

  menu_btn = 'menu';
  title = 'Point of Sale';
  userName = '';
  roleId = 0;
  currentUser!: UserInterface;
  logoUrl: any = '';

  pageFields: DeliveryInterface = {
    deliveryChargesID: '0', //0
    description: '', //1
    amount: '', //2
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.deliveryChargesID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.description,
      msg: 'enter description',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.amount,
      msg: 'enter amount',
      type: 'textbox',
      required: true,
    },
  ];

  error: any;
  deliveryList: any = [];

  constructor(
    private globalService: SharedServicesGlobalDataModule,
    private router: Router,
    private authService: SharedServicesAuthModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.globalService.header_title$.subscribe((str: string) => {
      this.title = str;
    });

    this.currentUser = this.authService.currentUserValue;
    this.userName = 'Hi, ' + this.currentUser.fullName;
    this.roleId = this.currentUser.roleId;

    this.getModuleData();
    this.getDelivery();
  }
  getModuleData() {
    this.dataService
      .getHttp(
        'user-api/ApplicationModule/getUserModules?roleId=' +
          this.roleId +
          '&userId=' +
          this.globalService.getUserId(),
        ''
      )
      .subscribe((response: ApplicationModuleInterface[]) => {
        this.applicationModulesList = response;

        // this.router.navigate(['home']);
        if (!localStorage.getItem('moduleId')) {
          this.globalService.setMenuItems(response[0].applicationModuleId);

          localStorage.setItem('moduleId', response[0].applicationModuleId);
        }
      });
  }

  public onToggleDrawer = () => {
    this.drawerToggle.emit();

    if (this.menu_btn == 'menu') {
      this.menu_btn = 'menu_open';
    } else if (this.menu_btn == 'menu_open') {
      this.menu_btn = 'menu';
    }
  };

  setSidebarMenu(selectedModule: any) {
    localStorage.setItem('moduleId', selectedModule.applicationModuleId);

    this.globalService.setMenuItems(selectedModule.applicationModuleId);
    this.router.navigate(['home']);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  getDelivery() {
    this.dataService
      .getHttp('core-api/DeliveryCharges/getDelvieryCharges', '')
      .subscribe(
        (response: any) => {
          this.deliveryList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  saveDelivery() {
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'core-api/DeliveryCharges/saveDeliveryCharges'
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.message == 'Success') {
            if (this.formFields[0].value == '0') {
              this.valid.apiInfoResponse('Record saved successfully');
            } else {
              this.valid.apiInfoResponse('Record updated successfully');
            }
            this.getDelivery();
            this.resetDelivery();
          } else {
            this.valid.apiErrorResponse(response.message.toString());
          }
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

  resetDelivery() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
  }
  editDelivery(item: any) {
    this.formFields[0].value = item.deliveryChargesID;
    this.formFields[1].value = item.description;
    this.formFields[2].value = item.amount;
  }
}
