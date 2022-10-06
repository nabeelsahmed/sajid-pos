import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PrintSaleComponent } from '../print-sale/print-sale.component';
declare var $: any;

@Component({
  selector: 'aims-pos-sale-table',
  templateUrl: './sale-table.component.html',
  styleUrls: ['./sale-table.component.scss']
})
export class SaleTableComponent implements OnInit {

  @ViewChild(PrintSaleComponent) printSale: any;

  error: any;
  tableData: any = [];
  detailTableData: any = [];
  
  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.getSale();
  }

  getSale(){
    this.dataService.getHttp('core-api/Sale/getSale?outletID=' + this.globalService.getOutletId().toString(), '').subscribe((response: any) => {
      this.tableData = response;
    }, (error: any) => {
      console.log(error);
    });
  }
  
  getSaleDetail(item: any, invoiceNo: any, name: any){
    this.dataService.getHttp('core-api/Sale/getSaleDetail?invoiceNo=' + invoiceNo, '').subscribe((response: any) => {
      this.detailTableData = response;
      if(name == 'detail'){
        $('#saleDetailModal').modal("show");

      }
      else{
        var tempList: any = [];
        for(var i = 0; i < response.length; i++){
          tempList.push({
            productID: response[i].productID,
            productName: response[i].productName,
            qty: response[i].qty,
            salePrice: response[i].salePrice,
            boxprice: 0,
            total: parseFloat(response[i].qty) * parseFloat(response[i].salePrice),
            costPrice: response[i].costPrice,
            invoiceDetailID: response[i].invoiceDetailID,
          })
        }
        
        this.printSale.tableData = tempList;

        this.printSale.lblInvoice = invoiceNo;
        this.printSale.lblDate = item.invoiceDate;
        this.printSale.lblGTotal = parseInt(item.cashReceived) + parseInt(item.change) ;
        this.printSale.lblDiscount = item.discount;
        this.printSale.lblCash = item.cashReceived;
        this.printSale.lblChange = item.change;

        setTimeout(()=> this.globalService.printData('#print-data'), 200);
      }
    }, (error: any) => {
      console.log(error);
    });
  }
}
