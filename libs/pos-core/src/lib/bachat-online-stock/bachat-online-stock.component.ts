import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import {
  BachatProductInterface,
  MyFormField,
} from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
declare var $: any;
@Component({
  selector: 'aims-pos-bachat-online-stock',
  templateUrl: './bachat-online-stock.component.html',
  styleUrls: ['./bachat-online-stock.component.scss'],
})
export class BachatOnlineStockComponent implements OnInit {
  tblSearch: any = '';

  txtDelCharges: any = '';
  txtPin: any = '';

  lblOrder: any = '';
  lblOrderID: any = '';

  dtpFromDate: any = '';
  dtpToDate: any = '';
  dtpDate: any = '';

  tableData: any = [];
  tempTableData: any = [];
  orderDetailList: any = [];
  orderHistoryList: any = [];

  pageFields: BachatProductInterface = {
    id: '',
    name: '',
    price: '',
    inventory: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.id,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.name,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.price,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.inventory,
      msg: '',
      type: 'textBox',
      required: false,
    },
  ];

  error: any;

  status: any = 'pend';
  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    // this.globalService.setHeaderTitle("Bachat Online Stock");

    this.dtpFromDate = new Date();
    this.dtpToDate = new Date();

    this.getOnlineProduct();
  }

  getOnlineProduct() {
    this.dataService
      .getHttp('bachat-online-api/Product/getPlaceOrder', '')
      .subscribe(
        (response: any) => {
          this.tableData = response;
          this.tempTableData = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  onDateChange(item: any) {
    this.tableData = this.tempTableData;

    var data = this.tableData.filter(
      (x: { orderDate: any }) =>
        this.datepipe.transform(x.orderDate, 'yyyy-MM-dd') ==
        this.datepipe.transform(item, 'yyyy-MM-dd')
    );

    this.tableData = data;
  }

  clearAll() {
    this.tblSearch = '';
    this.dtpDate = '';
    this.tableData = this.tempTableData;
  }

  getOrderDetail(item: any) {
    this.dataService
      .getHttp(
        'bachat-online-api/Product/getOrderDetail?orderID=' + item.orderID,
        ''
      )
      .subscribe(
        (response: any) => {
          this.orderDetailList = response;
          // $('#orderHistoryModal').modal('hide');
          $('#orderDetailModal').modal('show');
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  orderHistory() {
    if (this.dtpFromDate > this.dtpToDate) {
      this.valid.apiInfoResponse('select correct date');
    } else {
      this.dataService
        .getHttp(
          'bachat-online-api/Product/getOrderHistory?fromDate=' +
            this.datepipe.transform(this.dtpFromDate, 'yyy-MM-dd') +
            '&toDate=' +
            this.datepipe.transform(this.dtpToDate, 'yyy-MM-dd'),
          ''
        )
        .subscribe(
          (response: any) => {
            this.orderHistoryList = response;
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  checkPin(item: any, value: any) {
    if (
      this.globalService.getPinCode() == null ||
      this.globalService.getPinCode() == '0'
    ) {
      this.valid.apiErrorResponse('Pin not allowed');
      return;
    } else {
      $('#pinModal').modal('show');
      this.lblOrder = item.orderID;
      this.status = value;
    }
  }

  pin() {
    if (this.txtPin == '') {
      this.valid.apiErrorResponse('enter pin');
      return;
    } else {
      this.dataService
        .getHttp(
          'user-api/User/getPin?pin=' +
            this.txtPin +
            '&userID=' +
            this.globalService.getUserId(),
          ''
        )
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.length == 0) {
              this.valid.apiErrorResponse('Invalid pin');
              return;
            } else {
              if (this.status == 'delete') {
                this.delete();
              } else {
                var pageFields = {
                  status: '',
                  orderID: '',
                };

                var formFields: MyFormField[] = [
                  {
                    value: pageFields.status,
                    msg: '',
                    type: 'hidden',
                    required: false,
                  },
                  {
                    value: pageFields.orderID,
                    msg: '',
                    type: 'hidden',
                    required: false,
                  },
                ];

                formFields[0].value = 'pend';
                formFields[1].value = this.lblOrder;

                this.dataService
                  .deleteHttp(
                    pageFields,
                    formFields,
                    'bachat-online-api/Product/acceptOrDeclineOrder'
                  )
                  .subscribe(
                    (response: any) => {
                      if (response.message == 'Success') {
                        this.valid.apiInfoResponse('Order placed successfully');
                        $('#pinModal').modal('hide');
                        this.lblOrder = '';
                        this.txtPin = '';
                        this.getOnlineProduct();
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
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  addDeliveryCharges(item: any) {
    this.lblOrderID = item.orderID;
    $('#deliveryChargesModal').modal('show');
  }

  deliverOrder() {
    if (
      this.txtDelCharges < 0 ||
      this.txtDelCharges == '' ||
      this.txtDelCharges == undefined
    ) {
      this.valid.apiInfoResponse('enter delivery chargres');
      return;
    }
    var pageFields = {
      status: '',
      orderID: '',
      deliveryCharges: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.status,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.orderID,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.deliveryCharges,
        msg: '',
        type: 'hidden',
        required: false,
      },
    ];

    formFields[0].value = 'comp';
    formFields[1].value = this.lblOrderID;
    formFields[2].value = this.txtDelCharges;

    this.dataService
      .deleteHttp(
        pageFields,
        formFields,
        'bachat-online-api/Product/placeOrder'
      )
      .subscribe(
        (response: any) => {
          if (response.message == 'Success') {
            this.valid.apiInfoResponse('Order send successfully');
            this.getOnlineProduct();

            this.txtDelCharges = '';

            $('#deliveryChargesModal').modal('hide');
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

  delete() {
    var pageFields = {
      status: '',
      orderID: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.status,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.orderID,
        msg: '',
        type: 'hidden',
        required: false,
      },
    ];

    formFields[0].value = 'cancel';
    formFields[1].value = this.lblOrder;

    this.dataService
      .deleteHttp(
        pageFields,
        formFields,
        'bachat-online-api/Product/cancelOrder'
      )
      .subscribe(
        (response: any) => {
          if (response.message == 'Success') {
            this.valid.apiInfoResponse('Order placed successfully');
            $('#pinModal').modal('hide');
            this.lblOrder = '';
            this.txtPin = '';
            this.getOnlineProduct();
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

  reset() {
    this.orderHistoryList = [];

    this.dtpFromDate = new Date();
    this.dtpToDate = new Date();
  }
}
