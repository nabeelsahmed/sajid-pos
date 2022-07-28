import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-opening-balance-table',
  templateUrl: './opening-balance-table.component.html',
  styleUrls: ['./opening-balance-table.component.scss']
})
export class OpeningBalanceTableComponent implements OnInit {

  tableData: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
  ) { }

  ngOnInit(): void {
    this.getBalance();
  }

  getBalance(){
    this.dataService.getHttp('core-api/OpeningBalance/getOpeningBalance', '').subscribe((response: any) => {
      this.tableData = response;
    }, (error: any) => {
      console.log(error);
    });
  }

}
