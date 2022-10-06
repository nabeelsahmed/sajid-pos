import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aims-pos-product-sale-table',
  templateUrl: './product-sale-table.component.html',
  styleUrls: ['./product-sale-table.component.scss']
})
export class ProductSaleTableComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();

  tableData: any = [];

  constructor(private valid: SharedHelpersFieldValidationsModule) { }

  ngOnInit(): void {
  }

  totalBill(index: any, qty: any, item: any){

    // if(qty >= item.packing){
    //   this.tableData[index].total = Math.round((item.packingSalePrice / item.packing) * qty);
    // }else{

    // alert(item.salePrice);
    // alert(qty);
    if(this.tableData[index].boxprice == undefined || this.tableData[index].boxprice == ''){
      this.tableData[index].boxprice = 0;
    } 
    
    if(qty <= this.tableData[index].availableqty){
      this.tableData[index].total = 0;
      this.tableData[index].total =  parseFloat(item.salePrice) * parseFloat(qty) + parseInt(this.tableData[index].boxprice);
      ;
    }else{
      this.tableData[index].qty = this.tableData[index].availableqty;
      this.tableData[index].total = parseFloat(item.salePrice) * parseFloat(this.tableData[index].availableqty) + parseInt(this.tableData[index].boxprice);


      this.valid.apiErrorResponse('Available quantity is exceed');return;
    }
      // this.tableData[index].total = parseInt(item.salePrice) * parseInt(qty) + parseInt(this.tableData[index].boxprice);
      // alert(this.tableData[index].total);
      // }
    this.eventEmitter.emit();
  }


  delete(index: any){
    this.tableData.splice(index, 1);
    // this.tableData[index].status = 'deleted';
    this.eventEmitter.emit();
  }
}
