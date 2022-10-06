import { Component, OnInit } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { DatePipe } from '@angular/common'
import { RepositionScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'aims-pos-ledger-report',
  templateUrl: './ledger-report.component.html',
  styleUrls: ['./ledger-report.component.scss']
})
export class LedgerReportComponent implements OnInit {

  cmbCOA: string = '';
  cmbOutlet: string = '';
  lblAccountHead = '';
  dtpFromDate = '';
  dtpToDate = '';
  lblTotalDebit = 0;
  lblTotalCredit = 0;
  lblTotalBalance = 0;
  lblOutletName: string = '';
  outletID:string = '0';

  coaList: any = [];
  outletList: any = [];
  reportList:any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getChartOfAccount();
    this.getOutlet();
    
    this.outletID = this.globalService.getOutletId().toString();
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
  
  getAccountHead(item: any){
    var data = this.coaList.filter(
      (x: { coaID: any }) =>
        x.coaID == item
    );

    this.lblAccountHead = data[0].coaTitle;
  }

  showReport(){

    if(this.cmbCOA == '' || this.cmbCOA == undefined || this.cmbCOA == null){
      this.valid.apiErrorResponse('select account head');
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

    // this.reportList.push({
    //   invoiceNo: '1',
    //   invoiceType: 'S',
    //   invoiceDate: '2022-03-10',
    //   instrumentNo: '213123121',
    //   description: 'teeaytsdvcbn v',
    //   debit: '15000',
    //   credit: '5000',
    //   balance: '10000',

    // })

    var params = '';
    if(this.outletID == '1'){
      if(this.cmbOutlet == '' || this.cmbOutlet == undefined){
        params = '?coaID=' + this.cmbCOA + '&fromDate=' + this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') + '&toDate=' + this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd');
      }else{
        params = '?coaID=' + this.cmbCOA + '&fromDate=' + this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') + '&toDate=' + this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd') + '&outletid='+ this.cmbOutlet;
      }
    }else{
      params = '?coaID=' + this.cmbCOA + '&fromDate=' + this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') + '&toDate=' + this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd') + '&outletid='+ this.outletID;
    }
    this.dataService.getHttp('report-api/FMISReport/getLedgerReport' + params, '').subscribe(
      (response: any) => {
        // this.reportList = response;
        // console.log(response);
        var balance = 0;
        for(var i = 0; i < response.length; i++){
          balance = balance + (parseInt(response[i].debit) - parseInt(response[i].credit)); 
          this.reportList.push({
            invoiceno: response[i].invoiceno,
            invoicetype: response[i].invoicetype,
            invoicedate: response[i].invoicedate,
            instrumentno: response[i].instrumentno,
            description: response[i].description,
            debit: response[i].debit,
            credit: response[i].credit,
            balance: balance,
          });
          
          this.lblTotalDebit += response[i].debit;
          this.lblTotalCredit += response[i].credit;
          this.lblTotalBalance = balance;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
