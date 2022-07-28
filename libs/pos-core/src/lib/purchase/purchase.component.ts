import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, SaleInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductPurchaseTableComponent } from './product-purchase-table/product-purchase-table.component';

declare var $: any;

@Component({
  selector: 'aims-pos-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  @ViewChild(ProductPurchaseTableComponent) productPurchaseTable: any;
  
  searchProduct:any = '';
  cmbProduct: any = '';
  lblTotal: any = 0;
  lblCash: any = 0;
  lblInvoiceNo: any = 0;

  pageFields: SaleInterface = {
    invoiceNo: '0',
    userID: '',
    invoiceDate: '',
    refInvoiceNo: '0',
    refInvoiceDate: '',
    partyID: '0',
    discount: '0',
    cashReceived: '0',
    change: '0',
    description: '',
    branchID: '',
    json: '',
  };
  
  formFields: MyFormField[] = [
    {
      value: this.pageFields.invoiceNo,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.invoiceDate,
      msg: '',
      type: 'date',
      required: false,
    },
    {
      value: this.pageFields.refInvoiceNo,
      msg: 'enter reference invoice no',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.refInvoiceDate,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.partyID,
      msg: 'select supplier',
      type: 'selectBox',
      required: true,
    },
    {
      value: this.pageFields.discount,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.cashReceived,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.change,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.description,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.branchID,
      msg: 'enter product name',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.json,
      msg: 'enter products',
      type: 'textBox',
      required: true,
    },
  ];

  error: any;

  productList: any = [];
  partyList: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();

    var curDate = new Date();
    this.formFields[2].value = curDate;

    this.formFields[10].value = 1;
    
    this.getProduct();
    this.getParty();
  }

  getProduct(){
    this.dataService.getHttp('core-api/Product/getProduct', '').subscribe((response: any) => {
      this.productList = response;
    }, (error: any) => {
      console.log(error);
    });
  }
  
  getParty(){
    this.dataService.getHttp('core-api/Party/getParty', '').subscribe((response: any) => {
      this.partyList = response;
    }, (error: any) => {
      console.log(error);
    });
  }

  pushProduct(item: any){
    var data = this.productList.filter((x: {productID: any}) => 
                                        x.productID == item );
    
    if(this.productPurchaseTable.tableData.length == 0){
      this.productPurchaseTable.tableData.push({
        productID: data[0].productID,
        barcode1: data[0].barcode1,
        productName: data[0].productName,
        qty: 1,
        costPrice: data[0].costPrice,
        salePrice: data[0].salePrice,
        locationID: data[0].locationID,
        total: data[0].salePrice,
      })
    }else{

      var found = false;
      var index = 0;
      for(var i = 0; i < this.productPurchaseTable.tableData.length; i++){
        if(this.productPurchaseTable.tableData[i].productID == item){
          found = true;
          index = i;
          i = this.productPurchaseTable.tableData.length + 1;
        }
      }

      if(found == true){
        this.productPurchaseTable.tableData[index].qty += 1;
        this.productPurchaseTable.tableData[index].total = this.productPurchaseTable.tableData[index].salePrice * this.productPurchaseTable.tableData[index].qty;
      }else{
        this.productPurchaseTable.tableData.push({
          productID: data[0].productID,
          barcode1: data[0].barcode1,
          productName: data[0].productName,
          qty: 1,
          costPrice: data[0].costPrice,
          salePrice: data[0].salePrice,
          locationID: data[0].locationID,
          total: data[0].salePrice,
        })
      }
    }

    this.lblTotal = 0;
    for(var i = 0; i < this.productPurchaseTable.tableData.length; i++){
      this.lblTotal += this.productPurchaseTable.tableData[i].total;
    }

    this.formFields[8].value = -this.lblTotal;
  }

  totalBill(){

    this.lblTotal = 0;
    for(var i = 0; i < this.productPurchaseTable.tableData.length; i++){
      this.lblTotal += this.productPurchaseTable.tableData[i].total;
    }

    this.formFields[8].value = -this.lblTotal;
  }

  changeValue(){
    if(this.formFields[8].value == ''){
      this.formFields[8].value = 0;
    }
    if(this.formFields[6].value == ''){
      this.formFields[6].value = 0;
    }
    if(this.formFields[7].value == ''){
      this.formFields[7].value = 0;
    }

    this.formFields[8].value = (parseInt(this.formFields[6].value) + parseInt(this.formFields[7].value)) - this.lblTotal;

  }

  // save(printSection: string) {
  save() {

    this.lblCash = this.formFields[7].value;

    this.formFields[11].value = JSON.stringify(this.productPurchaseTable.tableData);

    if(this.productPurchaseTable.tableData.length == 0){
      this.valid.apiInfoResponse("enter products");
      return;
    }
    if((this.formFields[3].value == '' || this.formFields[3].value == '0') && (this.formFields[7].value == 0)){
      this.valid.apiInfoResponse("enter cash");
      return;
    }

    if(this.formFields[3].value == ''){
      var cash = parseInt(this.formFields[6].value) + parseInt(this.formFields[7].value);
      if(this.lblTotal > cash){
        this.valid.apiInfoResponse("enter correct cash");
        return;
      }
    }
    

    if(this.lblTotal < parseInt(this.formFields[6].value)){
      this.formFields[6].value = parseInt(this.formFields[6].value) - parseInt(this.formFields[8].value);
    }

    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'core-api/Purchase/savePurchase'
    )
    .subscribe(
      (response: any) => {
        console.log(response);
        if(response.message == 'Success'){

          this.valid.apiInfoResponse('record saved successfully');

          // this.printSale.tableData = this.productSaleTable.tableData;

          // this.printSale.lblInvoice = response.invoiceNo;
          // this.printSale.lblDate = date;
          // this.printSale.lblGTotal = this.lblTotal;
          // this.printSale.lblDiscount = this.formFields[6].value;
          // this.printSale.lblCash = this.lblCash;
          // this.printSale.lblChange = this.formFields[8].value;
      
          // setTimeout(()=> this.globalService.printData(printSection), 200);
          this.reset();
        }else{
          this.valid.apiErrorResponse(response.toString());
        }
      },
      (error: any) => {
        this.error = error;
        this.valid.apiErrorResponse(this.error);
      }
    );    
  }

  checkPurchaseReturn(){

    if(this.productPurchaseTable.tableData.length == 0){
      this.valid.apiInfoResponse("enter products");
      return;
    }

    $("#purchaseReturnModal").modal("show");
  }

  purchaseReturn(){
    this.dataService.getHttp('core-api/Purchase/getPurchaseReturn?invoiceNo=' + this.lblInvoiceNo, '').subscribe((response: any) => {
      if(response.length == 0){
        this.valid.apiInfoResponse('no invoice found');
        return;
      }else{
        let result = this.productPurchaseTable.tableData.filter
                      ((r1: {productID: any, qty: any}) => 
                      response.some((r2: {productID: any, qty: any}) => 
                      r1.productID === r2.productID && r1.qty <= r2.qty));

        if(this.productPurchaseTable.tableData.length == result.length){

          this.lblCash = this.formFields[7].value;

          this.formFields[3].value = this.lblInvoiceNo;
          this.formFields[4].value = new Date();

          this.formFields[11].value = JSON.stringify(this.productPurchaseTable.tableData);
          
          console.log(this.formFields[11].value)
          this.dataService
          .savetHttp(
            this.pageFields,
            this.formFields,
            'core-api/Purchase/savePurchaseReturn'
          )
          .subscribe(
            (response: any) => {
              console.log(response);
              if(response.message == "Success"){
    
                this.valid.apiInfoResponse('record saved successfully');
    
                this.reset();
              }else{
                this.valid.apiErrorResponse(response.toString());
              }
            },
            (error: any) => {
              this.error = error;
              this.valid.apiErrorResponse(this.error);
            }
          );
    
        }else{
          this.valid.apiErrorResponse('product not found in sale invoice');
          return;
        }
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  reset(){
    this.formFields = this.valid.resetFormFields(this.formFields);

    this.formFields[0].value = '0';
    this.formFields[2].value = new Date();
    this.formFields[3].value = '';
    this.formFields[4].value = '';
    this.formFields[5].value = '';
    this.formFields[6].value = '0';
    this.formFields[7].value = '0';
    this.formFields[8].value = '0';
    this.formFields[9].value = '';

    this.lblInvoiceNo = 0;
    this.searchProduct = '';
    this.cmbProduct = '';
    this.lblTotal = 0;
    this.lblCash = 0;
    this.productPurchaseTable.tableData = [];
    
    $("#purchaseReturnModal").modal("hide");
  }

}
