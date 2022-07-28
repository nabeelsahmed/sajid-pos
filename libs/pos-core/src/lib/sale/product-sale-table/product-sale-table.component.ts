import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aims-pos-product-sale-table',
  templateUrl: './product-sale-table.component.html',
  styleUrls: ['./product-sale-table.component.scss']
})
export class ProductSaleTableComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();

  tableData: any = [];

  constructor() { }

  ngOnInit(): void {
  }

  totalBill(index: any, qty: any, item: any){

    if(qty >= item.packing){
      this.tableData[index].total = Math.round((item.packingSalePrice / item.packing) * qty);
    }else{
      this.tableData[index].total = this.tableData[index].salePrice * qty;
    }
    this.eventEmitter.emit();
  }


  delete(index: any){
    // this.tableData.splice(index, 1);
    this.tableData[index].status = 'deleted';
    this.eventEmitter.emit();
  }
}
