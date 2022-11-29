import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-present-stock-report',
  templateUrl: './present-stock-report.component.html',
  styleUrls: ['./present-stock-report.component.scss']
})
export class PresentStockReportComponent implements OnInit {

  dtpCurrentDate: any = '';
  cmbOutlet: any = '';
  
  stockList: any = [];
  outletList: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.dtpCurrentDate = new Date();

    this.getOutlet();
  }

  getOutlet(){
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe((response: any) => {
      this.outletList = response;
    }, (error: any) => {
      console.log(error);
    });
  }

  getCurrentStock(){
    if(this.cmbOutlet == ''){
      this.valid.apiInfoResponse('select outlet');return;
    }

    this.dataService.getHttp('report-api/PosCoreReport/getCurrentStock?outletID=' + this.cmbOutlet + '&currentDate=' + this.datepipe.transform(this.dtpCurrentDate, 'yyyy-MM-dd'), '').subscribe((response: any) => {
      this.stockList = [];
      for(var i = 0; i < response.length; i++){
        this.stockList.push({
          productName: response[i].productName,
          openingbalance: response[i].openingbalance,
          saleqty: response[i].saleqty,
          closingbalance: response[i].openingbalance + response[i].saleqty
        })
      }
      // console.log(response)
    }, (error: any) => {
      console.log(error);
    });
  }

}
