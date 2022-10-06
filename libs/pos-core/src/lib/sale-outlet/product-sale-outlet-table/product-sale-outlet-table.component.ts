import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aims-pos-product-sale-outlet-table',
  templateUrl: './product-sale-outlet-table.component.html',
  styleUrls: ['./product-sale-outlet-table.component.scss']
})
export class ProductSaleOutletTableComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();

  tableData: any = [];

  constructor(private valid: SharedHelpersFieldValidationsModule) { }

  ngOnInit(): void {
  }

  totalBill(index: any, qty: any, item: any){

    // alert(this.tableData[index].salePrice);
    // alert(qty);
    // alert(item.packing);
    // alert(this.tableData[index].total);

    // if(parseInt(qty) < parseInt(item.packing)){
    //   alert('if')
    //   this.tableData[index].total = Math.round((item.packingSalePrice / item.packing) * qty);
    // }else{
      // alert('else')
      // alert(this.tableData[index].availableqty) 
      // alert(qty)
      if(qty <= this.tableData[index].availableqty){
        this.tableData[index].total = 0;
        this.tableData[index].total = parseInt(this.tableData[index].costPrice) * qty;
      }else{
        this.tableData[index].qty = this.tableData[index].availableqty;
        this.tableData[index].total = parseInt(this.tableData[index].costPrice) * this.tableData[index].availableqty;

        this.valid.apiErrorResponse('Available quantity is exceed');return;
      }
      
    // }
    this.eventEmitter.emit();
  }


  delete(index: any){
    this.tableData.splice(index, 1);
    // this.tableData[index].status = 'deleted';
    this.eventEmitter.emit();
  }
}
