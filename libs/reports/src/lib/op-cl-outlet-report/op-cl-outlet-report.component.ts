import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'aims-pos-op-cl-outlet-report',
  templateUrl: './op-cl-outlet-report.component.html',
  styleUrls: ['./op-cl-outlet-report.component.scss'],
})
export class OpClOutletReportComponent implements OnInit {
  cmbOutlet: string = '';

  dtpCurrentDate = '';

  outletID: string = '0';
  lblOutletName: string = '';

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
      this.dtpCurrentDate == '' ||
      this.dtpCurrentDate == undefined ||
      this.dtpCurrentDate == null
    ) {
      this.valid.apiErrorResponse('select date');
      return;
    }
    var params = '';
    params =
      '?currentDate=' +
      this.datepipe.transform(this.dtpCurrentDate, 'yyyy-MM-dd') +
      '&outletID=' +
      this.cmbOutlet;

    this.dataService
      .getHttp('report-api/PosCoreReport/getAvailProductQty' + params, '')
      .subscribe(
        (response: any) => {
          this.reportList = [];

          // this.reportList = response;
          for (var i = 0; i < response.length; i++) {
            var openingQty: any = 0.0;
            var remQty: any = 0.0;
            var closingQty: any = 0.0;
            openingQty =
              parseFloat(response[i].availableqty) +
              parseFloat(response[i].inventorysenthm);

            remQty = parseFloat(openingQty) - parseFloat(response[i].saleqty);

            closingQty =
              parseFloat(openingQty) -
              parseFloat(response[i].saleqty) -
              parseFloat(response[i].returnohm);

            this.reportList.push({
              productName: response[i].productName,
              availableqty: response[i].availableqty,
              inventorysenthm: response[i].inventorysenthm,
              openingQty: openingQty,
              remQty: remQty,
              saleqty: response[i].saleqty,
              returnohm: response[i].returnohm,
              closingQty: closingQty,
            });
          }
          // this.reportList =
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  exportExcel() {
    this.globalService.exportExcel('section', 'Opening Closing Outlet Report');
  }
}
