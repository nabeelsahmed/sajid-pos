import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-party-ledger-report',
  templateUrl: './party-ledger-report.component.html',
  styleUrls: ['./party-ledger-report.component.scss'],
})
export class PartyLedgerReportComponent implements OnInit {
  cmbParty = '';
  cmbOutlet: string = '';
  lblPartyName = '';
  dtpFromDate = '';
  dtpToDate = '';
  lblTotalDebit = 0;
  lblTotalCredit = 0;
  lblTotalBalance = 0;
  lblOutletName: string = '';
  outletID: string = '0';

  partyList: any = [];
  outletList: any = [];
  reportList: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getParty();
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

  getParty() {
    this.dataService.getHttp('core-api/Party/getAllParties', '').subscribe(
      (response: any) => {
        this.partyList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getPartyName(item: any) {
    var data = this.partyList.filter(
      (x: { partyID: any }) => x.partyID == item
    );

    this.lblPartyName = data[0].partyName;
  }

  showReport() {
    if (
      this.cmbParty == '' ||
      this.cmbParty == undefined ||
      this.cmbParty == null
    ) {
      this.valid.apiErrorResponse('select party name');
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

    var params = '';
    if (this.outletID == '1') {
      if (this.cmbOutlet == '' || this.cmbOutlet == undefined) {
        params =
          '?partyID=' +
          this.cmbParty +
          '&fromDate=' +
          this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') +
          '&toDate=' +
          this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd');
      } else {
        params =
          '?partyID=' +
          this.cmbParty +
          '&fromDate=' +
          this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') +
          '&toDate=' +
          this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd') +
          '&outletid=' +
          this.cmbOutlet;
      }
    } else {
      params =
        '?partyID=' +
        this.cmbParty +
        '&fromDate=' +
        this.datepipe.transform(this.dtpFromDate, 'yyyy-MM-dd') +
        '&toDate=' +
        this.datepipe.transform(this.dtpToDate, 'yyyy-MM-dd') +
        '&outletid=' +
        this.outletID;
    }

    this.dataService
      .getHttp('report-api/FMISReport/getPartyLedgerReport' + params, '')
      .subscribe(
        (response: any) => {
          var balance = 0;
          for (var i = 0; i < response.length; i++) {
            balance =
              balance +
              (parseInt(response[i].debit) - parseInt(response[i].credit));
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

  exportExcel() {
    this.globalService.exportExcel('section', 'Party Ledger');
  }
}
