import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, PartyInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PartyTableComponent } from './party-table/party-table.component';

@Component({
  selector: 'aims-pos-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit {

  @ViewChild(PartyTableComponent) partyTable: any;
  
  pageFields: PartyInterface = {
    partyID: '0',
    userID: '',
    partyName: '',
    partyNameUrdu: '',
    cnic: '',
    type: '',
    rootID: '',
    address: '',
    addressUrdu: '',
    cityID: '',
    phone: '',
    mobile: '',
    description: '',
    focalPerson: '',
    outletid: ''
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.partyID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.partyName,
      msg: 'enter party name',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.partyNameUrdu,
      msg: 'enter party name urdu',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.cnic,
      msg: 'enter cnic',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.type,
      msg: 'select party type',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.rootID,
      msg: 'select route',
      type: 'selectbox',
      required: false,
    },
    {
      value: this.pageFields.address,
      msg: 'enter address',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.addressUrdu,
      msg: 'enter address urdu',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.cityID,
      msg: 'select city',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.phone,
      msg: 'enter phone',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.mobile,
      msg: 'enter mobile',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.description,
      msg: 'enter remarks',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.focalPerson,
      msg: 'enter person to contact',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.outletid,
      msg: '',
      type: 'selectbox',
      required: false,
    },
  ];
  
  cityList: any = [];
  routeList: any = [];
  outletList: any = [];
  
  tabIndex = 0;
  error: any;

  cnicMask = this.globalService.cnicMask();
  mobileMask = this.globalService.mobileMask();
  phoneMask = this.globalService.phoneMask();

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();

    this.getRoute();
    this.getCity();
    this.getOutlet();
  }

  getOutlet(){
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe(
      (response: any) => {
        this.outletList = response;
        // console.log(response)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRoute(){
    this.dataService.getHttp('core-api/Route/getRoute', '').subscribe(
      (response: any) => {
        this.routeList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCity(){
    this.dataService.getHttp('core-api/City/getCity', '').subscribe(
      (response: any) => {
        this.cityList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  outletChange(item: any){
    var data = this.outletList.filter(
      (x: { outletID: any }) =>
        x.outletID == item
    );

    this.formFields[2].value = data[0].outletName;
    this.formFields[7].value = data[0].outletAddress;
    this.formFields[13].value = data[0].contactPerson;
    this.formFields[11].value = data[0].mobileNo;
  }
  save() {

    // if(this.formFields[4].value == '' || this.formFields[4].value == null){
    //   this.valid.apiInfoResponse('enter cnic');return;
    // }

    // var strCnic = this.formFields[4].value.replace(/_/g, '')
    // if(strCnic.length < 15){
    //   this.valid.apiInfoResponse('enter correct cnic');return;
    // }

    this.formFields[6].value = '0';
    if(this.formFields[5].value != 'outlet'){
      this.formFields[14].value = '0';
    }

    if(this.formFields[11].value == '' || this.formFields[11].value == null){
      this.valid.apiInfoResponse('enter mobile no');return;
    }

    var strMobile = this.formFields[11].value.replace(/_/g, '')
    if(strMobile.length < 12){
      this.valid.apiInfoResponse('enter correct mobile no');return;
    }

    if(this.formFields[10].value != '' || this.formFields[10].value == null){
      var strPhone = this.formFields[11].value.replace(/_/g, '')
      if(strPhone.length < 11){
        this.valid.apiInfoResponse('enter correct phone no');return;
      }
    }

    if(this.formFields[5].value == 'outlet'){
      if(this.formFields[14].value == '' || this.formFields[14].value == null){
        this.valid.apiInfoResponse('select outlet');return;
      }
    }

    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'core-api/Party/saveParty'
    )
    .subscribe(
      (response: any) => {
        console.log(response);
        if(response.message == 'Success'){
          if(this.formFields[0].value == '0'){
            this.valid.apiInfoResponse('Record saved successfully');
          }else{
            this.valid.apiInfoResponse('Record updated successfully');
          }

          this.partyTable.getParty();
          this.reset();
        }else{
          this.valid.apiErrorResponse(response.message.toString());
        }
      },
      (error: any) => {
        this.error = error;
        this.valid.apiErrorResponse(this.error);
      }
    );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    
    this.formFields[0].value = '0';
    this.formFields[3].value = '';
    this.formFields[8].value = '';
    this.formFields[10].value = '';
    this.formFields[12].value = '';
    this.formFields[13].value = '';
  }

  edit(item: any){
    this.tabIndex = 0;

    this.formFields[0].value = item.partyID;
    this.formFields[2].value = item.partyName;
    this.formFields[3].value = item.partyNameUrdu;
    this.formFields[4].value = item.cnic;
    this.formFields[5].value = item.type;
    this.formFields[6].value = item.rootID;
    this.formFields[7].value = item.address;
    this.formFields[8].value = item.addressUrdu;
    this.formFields[9].value = item.cityID;
    this.formFields[10].value = item.phone;
    this.formFields[11].value = item.mobile;
    this.formFields[12].value = item.description;
    this.formFields[13].value = item.focalperson;
    this.formFields[14].value = item.outletid;
  }

  changeTabHeader(tabNum: any) {
    this.tabIndex = tabNum;
  }
  
  getKeyPressed(e: any){
    if(e.keyCode == 13){
      this.save();
    }
  }

  delete(item: any){
    this.reset();
  }
}
