import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, PaymentInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentTableComponent } from './payment-table/payment-table.component';

@Component({
  selector: 'aims-pos-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @ViewChild(PaymentTableComponent) paymentTable: any;
  
  pageFields: PaymentInterface = {
    invoiceNo: '0',
    userID: '',
    type: '',
    partyID: '',
    invoiceDate: '',
    categoryID: '',
    coaID: '',
    amount: '',
    discount: '',
    description: '',
    branchID: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.invoiceNo,
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
      value: this.pageFields.type,
      msg: 'select payment type',
      type: 'radio',
      required: true,
    },
    {
      value: this.pageFields.partyID,
      msg: 'select party name',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.invoiceDate,
      msg: 'select date',
      type: 'date',
      required: true,
    },
    {
      value: this.pageFields.categoryID,
      msg: 'select category',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.coaID,
      msg: 'select acoount head',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.amount,
      msg: 'enter amount',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.discount,
      msg: 'enter discount',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.description,
      msg: 'enter description',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.branchID,
      msg: '',
      type: '',
      required: false,
    },
  ];
  
  tabIndex = 0;
  error: any;

  partyList: any = [];
  coaList: any = [];
  categoryList: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();

    this.formFields[2].value = '1';
    this.getParty();
    this.getChartOfAccount();
    this.getCOASubTypeWise();
  }

  getCOASubTypeWise() {
    this.dataService.getHttp('fmis-api/ChartOfAccount/getCOASubTypeWise', '').subscribe(
      (response: any) => {
        this.categoryList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getParty() {
    this.dataService.getHttp('core-api/Party/getParty', '').subscribe(
      (response: any) => {
        this.partyList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getChartOfAccount() {
    this.dataService.getHttp('fmis-api/ChartOfAccount/getCOA', '').subscribe(
      (response: any) => {
        this.coaList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  getPaymentDetail(invoiceNo: any, type: any) {
    this.dataService.getHttp('core-api/Payment/getPaymentDetail?invoiceNo=' + invoiceNo, '').subscribe(
      (response: any) => {
        if(response.length == 3)
        {
          if(type == 'payment'){
            this.formFields[5].value = response[1].coaID;  //categoryID (cash bank)
            this.formFields[6].value = response[2].coaID;  //chart of account
          }else{
            this.formFields[5].value = response[1].coaID;  //categoryID (cash bank)
            this.formFields[6].value = response[2].coaID;  //chart of account
          }
        }else if(response.length == 2){
          if(type == 'payment'){
            this.formFields[5].value = response[0].coaID;  //categoryID (cash bank)
            this.formFields[6].value = response[1].coaID;  //chart of account
          }else{
            this.formFields[5].value = response[0].coaID;  //categoryID (cash bank)
            this.formFields[6].value = response[1].coaID;  //chart of account
          }
        }
        
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save() {

    this.formFields[10].value = '1';

    if(this.formFields[8].value == ''){
      this.formFields[8].value = '0';
    }

    if(this.formFields[0].value == '0'){
      this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'core-api/Payment/savePayment'
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          if(response.message == 'Success'){
            this.valid.apiInfoResponse('Record saved successfully');

            this.paymentTable.getPayment();
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
    }else{
      this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'core-api/Payment/updatePayment'
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          if(response.message == 'Success'){
            this.valid.apiInfoResponse('Record updated successfully');
  
            this.paymentTable.getPayment();
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
    
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    
    this.formFields[0].value = '0';
    this.formFields[7].value = '';
    this.formFields[8].value = '';
    this.formFields[9].value = '';
    this.formFields[2].value = '1';
  }

  edit(item: any){

    this.tabIndex = 0;

    this.getPaymentDetail(item.invoiceNo, item.invoiceType);
    this.formFields[0].value = item.invoiceNo;
    
    if(item.invoiceType == 'payment'){
      this.formFields[2].value = '1';  //type
    }else{
      this.formFields[2].value = '2';  //type
    }
    this.formFields[3].value = item.partyID;
    this.formFields[4].value = new Date(item.invoiceDate);
    this.formFields[7].value = item.cashReceived;
    this.formFields[8].value = item.discount;
    this.formFields[9].value = item.description;
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
