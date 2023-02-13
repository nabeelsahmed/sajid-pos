import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-in-out-stock-report',
  templateUrl: './in-out-stock-report.component.html',
  styleUrls: ['./in-out-stock-report.component.scss'],
})
export class InOutStockReportComponent implements OnInit {
  cmbOutlet: string = '';
  lblPartyName = '';
  dtpFromDate = '';
  dtpToDate = '';

  lblTotalIn: any = 0.0;
  lblTotalOut: any = 0.0;
  lblOutletName: string = '';
  outletID: string = '0';

  currentDate: any = '';

  outletList: any = [];
  reportList: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getOutlet();

    this.outletID = this.globalService.getOutletId().toString();
  }

  getOutlet() {
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe(
      (response: any) => {
        this.outletList = response;
        // console.log(response)
        if (this.outletID > '1') {
          var data = response.filter(
            (x: { outletID: any }) =>
              x.outletID == this.globalService.getOutletId()
          );
          this.lblOutletName = data[0].outletName;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  showReport() {
    if (
      this.cmbOutlet == '' ||
      this.cmbOutlet == undefined ||
      this.cmbOutlet == null
    ) {
      this.valid.apiErrorResponse('select outlet');
      return;
    }
    if (
      this.dtpFromDate == '' ||
      this.dtpFromDate == undefined ||
      this.dtpFromDate == null
    ) {
      this.valid.apiErrorResponse('select from date');
      return;
    }
    if (
      this.dtpToDate == '' ||
      this.dtpToDate == undefined ||
      this.dtpToDate == null
    ) {
      this.valid.apiErrorResponse('select to date');
      return;
    }

    if (this.dtpFromDate > this.dtpToDate) {
      this.valid.apiErrorResponse('select correct date');
      return;
    }
    var params = '';
    params =
      '?fromDate=' +
      this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') +
      '&toDate=' +
      this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd') +
      '&outletID=' +
      this.cmbOutlet;

    this.dataService
      .getHttp('report-api/PosCoreReport/getOverAllStockOutlet' + params, '')
      .subscribe(
        (response: any) => {
          this.lblTotalIn = 0.0;
          this.lblTotalOut = 0.0;
          this.reportList = [];

          // this.reportList = response
          for (var i = 0; i < response.length; i++) {
            if (response[i].productID > 0) {
              this.reportList.push({
                productID: response[i].productID,
                productName: response[i].productName,
                in: response[i].in,
                out: response[i].out,
              });
            }
            this.lblTotalIn += parseFloat(response[i].in);
            this.lblTotalOut += parseFloat(response[i].out);
          }

          if (this.cmbOutlet == '1') {
            this.getOverAllStock(params);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getOverAllStock(params: any) {
    this.dataService
      .getHttp('report-api/PosCoreReport/getOverAllStock' + params, '')
      .subscribe(
        (response: any) => {
          for (var i = 0; i < response.length; i++) {
            var found = false;
            for (var j = 0; j < this.reportList.length; j++) {
              if (response[i].productID === this.reportList[j].productID) {
                found = true;
                this.reportList[j].in =
                  parseFloat(this.reportList[j].in) +
                  parseFloat(response[i].in);
                this.reportList[j].out =
                  parseFloat(this.reportList[j].out) +
                  parseFloat(response[i].out);
                j = this.reportList.length + 1;
              }
            }
            if (found == false) {
              if (response[i].productID > 0) {
                this.reportList.push({
                  productID: response[i].productID,
                  productName: response[i].productName,
                  in: response[i].in,
                  out: response[i].out,
                });
              }
            }
            this.lblTotalIn += parseFloat(response[i].in);
            this.lblTotalOut += parseFloat(response[i].out);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  exportExcel() {
    this.globalService.exportExcel('section', 'IN OUT Stock');
  }
}
