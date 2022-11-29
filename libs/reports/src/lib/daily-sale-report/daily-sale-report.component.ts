import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-daily-sale-report',
  templateUrl: './daily-sale-report.component.html',
  styleUrls: ['./daily-sale-report.component.scss']
})
export class DailySaleReportComponent implements OnInit {

  tblSearch: any = '';

  cmbOutlet: string = '';
  lblPartyName = '';
  dtpFromDate = '';
  dtpToDate = '';

  lblTotalQty: any = 0.0;
  lblTotalSalePrice: any = 0.0;
  lblOutletName: string = '';
  outletID:string = '0';

  currentDate: any = '';

  outletList: any = [];
  reportList: any = [];
  tempReportList: any = [];

  // rptImg: any = 'assets/ui/ReportPictures/Logo.svg'

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

  getOutlet(){
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe((response: any) => {
      this.outletList = response;
      // console.log(response)
      if(this.outletID > '1'){
        var data = response.filter((x: {outletID: any})=> x.outletID == this.globalService.getOutletId());
        this.lblOutletName = data[0].outletName;
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  showReport(){

    if(this.cmbOutlet == '' || this.cmbOutlet == undefined || this.cmbOutlet == null){
      this.valid.apiErrorResponse('select outlet');
      return;
    }
    if(this.dtpFromDate == '' || this.dtpFromDate == undefined || this.dtpFromDate == null){
      this.valid.apiErrorResponse('select from date');
      return;
    }
    if(this.dtpToDate == '' || this.dtpToDate == undefined || this.dtpToDate == null){
      this.valid.apiErrorResponse('select to date');
      return;
    }

    var params = '';
    params = '?fromDate=' + this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') + '&toDate=' + this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd') + '&outletID='+ this.cmbOutlet;

    this.dataService.getHttp('report-api/PosCoreReport/getDailySalesOutlet' + params, '').subscribe(
      (response: any) => {
        this.lblTotalQty = 0.0;
        this.lblTotalSalePrice = 0.0;
        this.reportList = [];

        this.reportList = response
        for(var i = 0; i < response.length; i++){
          this.lblTotalQty += parseFloat(response[i].qty);
          this.lblTotalSalePrice += parseFloat(response[i].salePrice);
        }

        if(this.cmbOutlet == '1'){
          this.getDailySale(params);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getDailySale(params: any){
    this.dataService.getHttp('report-api/PosCoreReport/getDailySales' + params, '').subscribe(
      (response: any) => {
        // this.lblTotalQty = 0.0;
        // this.lblTotalSalePrice = 0.0;
        // this.reportList = [];


        for(var i = 0; i < response.length; i++){
          this.reportList.push({
            invoiceNo: response[i].invoiceNo,
            invoiceDate: response[i].invoiceDate,
            productName: response[i].productName,
            qty: response[i].qty,
            salePrice: response[i].salePrice,
          });

          this.lblTotalQty += parseFloat(response[i].qty);
          this.lblTotalSalePrice += parseFloat(response[i].salePrice);
        }

      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
