import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-profit-loss-report',
  templateUrl: './profit-loss-report.component.html',
  styleUrls: ['./profit-loss-report.component.scss']
})
export class ProfitLossReportComponent implements OnInit {

  cmbOutlet: string = '';
  dtpFromDate: any = '';
  dtpToDate: any = '';
  lblOutletName: string = '';
  outletID:string = '0';

  outletList: any = [];
  reportList: any = [];
  
  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.dtpFromDate = new Date();
    this.dtpToDate = new Date();
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
  
}
