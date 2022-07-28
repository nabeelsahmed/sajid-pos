import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, OpeningBalanceInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OpeningBalanceTableComponent } from './opening-balance-table/opening-balance-table.component';

@Component({
  selector: 'aims-pos-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss']
})
export class OpeningBalanceComponent implements OnInit {

  @ViewChild(OpeningBalanceTableComponent) openingBalanceTable: any;

  searchProduct: any = '';
  cmbCategory: any = '';
  lblCostPrice: any = 0;
  lblTotal: any = 0;
  tblSearch: any = '';
  searchCategory: any = '';

  // pageFields: OpeningBalanceInterface = {
  //   invoiceDate: '',
  //   userID: '',
  //   productID: '0',
  //   locationID: '0',
  //   costPrice: '0',
  //   salePrice: '',
  //   qty: '0',
  //   debit: '0',
  //   productName: '',
  // };
  
  // formFields: MyFormField[] = [
  //   {
  //     value: this.pageFields.invoiceDate,
  //     msg: 'enter date',
  //     type: 'date',
  //     required: true,
  //   },
  //   {
  //     value: this.pageFields.userID,
  //     msg: '',
  //     type: 'hidden',
  //     required: false,
  //   },
  //   {
  //     value: this.pageFields.productID,
  //     msg: 'select product',
  //     type: 'selectBox',
  //     required: true,
  //   },
  //   {
  //     value: this.pageFields.locationID,
  //     msg: '',
  //     type: '',
  //     required: false,
  //   },
  //   {
  //     value: this.pageFields.costPrice,
  //     msg: '',
  //     type: '',
  //     required: false,
  //   },
  //   {
  //     value: this.pageFields.salePrice,
  //     msg: '',
  //     type: '',
  //     required: false,
  //   },
  //   {
  //     value: this.pageFields.qty,
  //     msg: 'enter quantity',
  //     type: 'textBox',
  //     required: true,
  //   },
  //   {
  //     value: this.pageFields.debit,
  //     msg: '',
  //     type: '',
  //     required: false,
  //   },
  //   {
  //     value: this.pageFields.productName,
  //     msg: '',
  //     type: '',
  //     required: false,
  //   }
  // ];

  error: any;

  productList: any = [];
  categoryList: any = [];
  tableData: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    // this.globalService.setHeaderTitle("Opening Balance");
    // this.formFields[2].value = this.globalService.getUserId().toString();

    // this.getProduct();
    this.getCategory();
    
  }

  getCategory(){
    this.dataService.getHttp('core-api/Category/getSubCategory?catID=1', '').subscribe(
      (response: any) => {
        this.categoryList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  
  // getProduct(){
  //   this.dataService.getHttp('core-api/Product/getProduct', '').subscribe((response: any) => {
  //     this.productList = response;
  //   }, (error: any) => {
  //     console.log(error);
  //   });
  // }

  onCategoryChange(item: any){
    this.tblSearch = '';

    this.dataService.getHttp('core-api/OpeningBalance/getOpeningBalanceProduct?categoryID=' + item, '').subscribe((response: any) => {
      this.tableData = response;
      console.log(response)
    }, (error: any) => {
      console.log(error);
    });
  }

  // onProductChange(item: any){
    
  //   var data = this.productList.filter((x: {productID: any}) => x.productID == item);

  //   this.formFields[3].value = data[0].locationID;
  //   this.formFields[4].value = data[0].costPrice;
  //   this.formFields[5].value = data[0].salePrice;
  //   this.formFields[8].value = data[0].productName;

  //   this.lblTotal = this.formFields[4].value * this.formFields[6].value;
  // }

  // changeValue(){
  //   this.lblTotal = this.formFields[4].value * this.formFields[6].value;
  // }

  save(item: any) {
    var pageFields = {
      invoiceNo: '0',
      invoiceDate: '',
      userID: '',
      productID: '0',
      locationID: '0',
      costPrice: '0',
      salePrice: '',
      qty: '0',
      debit: '0',
      productName: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.invoiceNo,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.invoiceDate,
        msg: '',
        type: 'date',
        required: false,
      },
      {
        value: pageFields.userID,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.productID,
        msg: '',
        type: 'selectBox',
        required: false,
      },
      {
        value: pageFields.locationID,
        msg: '',
        type: '',
        required: false,
      },
      {
        value: pageFields.costPrice,
        msg: '',
        type: '',
        required: false,
      },
      {
        value: pageFields.salePrice,
        msg: '',
        type: '',
        required: false,
      },
      {
        value: pageFields.qty,
        msg: 'enter quantity',
        type: 'textBox',
        required: true,
      },
      {
        value: pageFields.debit,
        msg: '',
        type: '',
        required: false,
      },
      {
        value: pageFields.productName,
        msg: '',
        type: '',
        required: false,
      }
    ];

    formFields[0].value = item.invoiceNo;
    formFields[1].value = new Date();
    formFields[2].value = this.globalService.getUserId().toString()
    formFields[3].value = item.productID;
    formFields[4].value = item.locationID;
    formFields[5].value = item.costPrice;
    formFields[6].value = item.salePrice;
    formFields[7].value = item.qty;
    formFields[8].value = formFields[5].value * formFields[6].value;
    formFields[9].value = item.productName;

    this.dataService
    .savetHttp(
      pageFields,
      formFields,
      'core-api/OpeningBalance/saveBalance'
    )
    .subscribe(
      (response: any) => {
        console.log(response);
        if(response.message == 'Success'){

          this.valid.apiInfoResponse('Record saved successfully');

          this.onCategoryChange(this.cmbCategory);
          this.reset();
        }else{
          this.valid.apiErrorResponse(response.message.toString());
        }
      },
      (error: any) => {
        this.error = error;
        this.valid.apiErrorResponse(this.error);
      }
    );
  }

  reset(){
    // this.formFields = this.valid.resetFormFields(this.formFields);

    // this.formFields[3].value = '0';
    // this.formFields[4].value = '0';
    // this.formFields[5].value = '';
    // this.formFields[7].value = '0';
    // this.formFields[8].value = '';
    
    this.searchProduct = '';
    // this.lblTotal = 0;
  }

  getKeyPressed(e: any){
    if(e.keyCode == 13){
      // this.save();
    }
  }

}
