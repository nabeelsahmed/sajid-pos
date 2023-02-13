import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, SaleOutletInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrintSaleOutletComponent } from './print-sale-outlet/print-sale-outlet.component';
import { ProductSaleOutletTableComponent } from './product-sale-outlet-table/product-sale-outlet-table.component';

declare var $: any;

@Component({
  selector: 'aims-pos-sale-outlet',
  templateUrl: './sale-outlet.component.html',
  styleUrls: ['./sale-outlet.component.scss'],
})
export class SaleOutletComponent implements OnInit {
  @ViewChild(ProductSaleOutletTableComponent) productSaleOutletTable: any;
  @ViewChild(PrintSaleOutletComponent) printSaleOutlet: any;

  @ViewChild('txtCash') _txtCash: ElementRef;
  @ViewChild('txtFocusCode') _txtFocusCode: ElementRef;

  searchProduct: any = '';
  cmbProduct: any = '';
  txtCode: any = '';
  lblTotal: any = 0;
  lblCash: any = 0;
  lblInvoiceNo: any = 0;

  pageFields: SaleOutletInterface = {
    invoiceNo: '0',
    userID: '',
    invoiceDate: '',
    partyID: '0',
    refInvoiceNo: '0',
    refInvoiceDate: '',
    discount: '0',
    cashReceived: '0',
    change: '0',
    description: '',
    branchID: '',
    json: '',
    outletid: '',
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
      value: this.pageFields.partyID,
      msg: 'select outlet',
      type: 'selectBox',
      required: true,
    },
    {
      value: this.pageFields.refInvoiceNo,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.refInvoiceDate,
      msg: '',
      type: '',
      required: false,
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
    {
      value: this.pageFields.outletid,
      msg: '',
      type: '',
      required: false,
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
    // this.globalService.setHeaderTitle("Sale");
    this.formFields[1].value = this.globalService.getUserId().toString();

    this.formFields[10].value = 1;

    this.getProduct();
    this.getParty();
  }

  getProduct() {
    // alert(this.globalService.getOutletId().toString());
    this.dataService
      .getHttp(
        'core-api/Product/getAvailProduct?outletID=' +
          this.globalService.getOutletId().toString(),
        ''
      )
      .subscribe(
        (response: any) => {
          this.productList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getParty() {
    this.dataService.getHttp('core-api/Party/getPartyOutlet', '').subscribe(
      (response: any) => {
        this.partyList = response;
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onChangeOutlet(item: any) {
    var data = this.partyList.filter(
      (x: { partyID: any }) => x.partyID == item
    );

    // console.log(data)
    this.formFields[12].value = data[0].outletid;
  }

  pushProductByCode(item: any, e: any) {
    if (e.ctrlKey == true) {
      //   // alert(e.keyCode);
      this._txtCash.nativeElement.focus();
      this.formFields[7].value = '';
      this.txtCode = '';
    }
    if (e.keyCode == 13) {
      return;
    }
    var data = this.productList.filter(
      (x: { barcode1: any; barcode2: any; barcode3: any }) =>
        x.barcode1 == item.toString() && x.barcode2 == '' && x.barcode3 == ''
    );

    if (data.length == 0 && item.toString() != '') {
      data = this.productList.filter(
        (x: { barcode1: any; barcode2: any; barcode3: any }) =>
          x.barcode2 == item.toString() && x.barcode3 == ''
      );

      if (data.length == 0 && item.toString() != '') {
        var data = this.productList.filter(
          (x: { barcode1: any; barcode2: any; barcode3: any }) =>
            x.barcode3 == item.toString()
        );

        if (data.length == 0) {
          return;
        }
      }
    }
    if (this.productSaleOutletTable.tableData.length == 0) {
      this.productSaleOutletTable.tableData.push({
        // barcode1: data[0].barcode1,
        // barcode2: data[0].barcode2,
        // barcode3: data[0].barcode3,
        productID: data[0].productID,
        productName: data[0].productName,
        qty: 1,
        costPrice: data[0].costPrice,
        salePrice: data[0].salePrice,
        invoiceDate: data[0].invoiceDate,
        pPriceID: data[0].pPriceID,
        outletid: data[0].outletid,
        availableqty: data[0].availableqty,
        total: parseInt(data[0].costPrice),
        // locationID: data[0].locationID,
        // total: data[0].salePrice,
        // packing: data[0].packing,
        // packingSalePrice: data[0].packingSalePrice,
        // status: ''
      });
    } else {
      var found = false;
      var index = 0;
      for (var i = 0; i < this.productSaleOutletTable.tableData.length; i++) {
        if (
          this.productSaleOutletTable.tableData[i].barcode1 == item ||
          this.productSaleOutletTable.tableData[i].barcode2 == item ||
          this.productSaleOutletTable.tableData[i].barcode3 == item
        ) {
          found = true;
          index = i;
          i = this.productSaleOutletTable.tableData.length + 1;
        }
      }
      if (found == true) {
        // if(this.productSaleOutletTable.tableData[index].status == 'deleted'){
        //   this.productSaleOutletTable.tableData[index].status = '';
        // }else{
        this.productSaleOutletTable.tableData[index].qty += 1;
        this.productSaleOutletTable.tableData[index].total =
          parseInt(this.productSaleOutletTable.tableData[index].costPrice) *
          this.productSaleOutletTable.tableData[index].qty;
        // }
      } else {
        this.productSaleOutletTable.tableData.unshift({
          // barcode1: data[0].barcode1,
          // barcode2: data[0].barcode2,
          // barcode3: data[0].barcode3,
          productID: data[0].productID,
          productName: data[0].productName,
          qty: 1,
          costPrice: data[0].costPrice,
          salePrice: data[0].salePrice,
          invoiceDate: data[0].invoiceDate,
          pPriceID: data[0].pPriceID,
          outletid: data[0].outletid,
          availableqty: data[0].availableqty,
          total: parseInt(data[0].costPrice),
          // locationID: data[0].locationID,
          // total: data[0].salePrice,
          // packing: data[0].packing,
          // packingSalePrice: data[0].packingSalePrice,
          // status: ''
        });
      }
    }

    this.lblTotal = 0;
    for (var i = 0; i < this.productSaleOutletTable.tableData.length; i++) {
      this.lblTotal += this.productSaleOutletTable.tableData[i].total;
    }

    this.formFields[8].value = -this.lblTotal;
    this.txtCode = '';
  }

  pushProduct(item: any) {
    var data = this.productList.filter(
      (x: { pPriceID: any }) => x.pPriceID == item
    );

    if (this.productSaleOutletTable.tableData.length == 0) {
      this.productSaleOutletTable.tableData.push({
        // barcode1: data[0].barcode1,
        // barcode2: data[0].barcode2,
        // barcode3: data[0].barcode3,
        productID: data[0].productID,
        productName: data[0].productName,
        qty: 1,
        costPrice: data[0].costPrice,
        salePrice: data[0].salePrice,
        invoiceDate: data[0].invoiceDate,
        pPriceID: data[0].pPriceID,
        outletid: data[0].outletid,
        availableqty: data[0].availableqty,
        total: parseInt(data[0].costPrice),
        // locationID: data[0].locationID,
        // total: data[0].salePrice,
        // packing: data[0].packing,
        // packingSalePrice: data[0].packingSalePrice,
        // status:''
      });
    } else {
      var found = false;
      var index = 0;
      for (var i = 0; i < this.productSaleOutletTable.tableData.length; i++) {
        if (this.productSaleOutletTable.tableData[i].pPriceID == item) {
          found = true;
          index = i;
          i = this.productSaleOutletTable.tableData.length + 1;
        }
      }

      if (found == true) {
        // if(this.productSaleOutletTable.tableData[index].status == 'deleted'){
        //   this.productSaleOutletTable.tableData[index].status = '';
        // }else{
        //   // this.productSaleOutletTable.tableData[index].availableqty -= 1;
        this.productSaleOutletTable.tableData[index].qty += 1;
        this.productSaleOutletTable.tableData[index].total =
          parseInt(this.productSaleOutletTable.tableData[index].costPrice) *
          this.productSaleOutletTable.tableData[index].qty;
        // }
      } else {
        this.productSaleOutletTable.tableData.unshift({
          // barcode1: data[0].barcode1,
          // barcode2: data[0].barcode2,
          // barcode3: data[0].barcode3,
          productID: data[0].productID,
          productName: data[0].productName,
          qty: 1,
          costPrice: data[0].costPrice,
          salePrice: data[0].salePrice,
          invoiceDate: data[0].invoiceDate,
          pPriceID: data[0].pPriceID,
          outletid: data[0].outletid,
          availableqty: data[0].availableqty,
          total: parseInt(data[0].costPrice),
          // locationID: data[0].locationID,
          // total: data[0].salePrice,
          // packing: data[0].packing,
          // packingSalePrice: data[0].packingSalePrice,
          // status: ''
        });
      }
    }

    this.lblTotal = 0;
    for (var i = 0; i < this.productSaleOutletTable.tableData.length; i++) {
      this.lblTotal += parseInt(this.productSaleOutletTable.tableData[i].total);
    }

    this.formFields[8].value = -this.lblTotal;
  }

  totalBill() {
    this.lblTotal = 0;
    for (var i = 0; i < this.productSaleOutletTable.tableData.length; i++) {
      // if(this.productSaleOutletTable.tableData[i].status != 'deleted')
      this.lblTotal += parseInt(this.productSaleOutletTable.tableData[i].total);
    }

    this.formFields[8].value = -this.lblTotal;
  }

  changeValue() {
    if (this.formFields[8].value == '') {
      this.formFields[8].value = 0;
    }
    if (this.formFields[6].value == '') {
      this.formFields[6].value = 0;
    }
    // if(this.formFields[7].value == ''){
    //   this.formFields[7].value = 0;
    // }
    if (this.formFields[7].value == '' || this.formFields[7].value == null) {
      this.valid.apiInfoResponse('enter cash');
      this.formFields[8].value = 0 - this.lblTotal;
      return;
    }
    this.formFields[8].value =
      parseInt(this.formFields[6].value) +
      parseInt(this.formFields[7].value) -
      this.lblTotal;
  }

  save(printSection: string) {
    var date = new Date();

    this.lblCash = this.formFields[7].value;

    this.formFields[2].value = new Date();

    var prodTableData: any = [];

    for (var i = 0; i < this.productSaleOutletTable.tableData.length; i++) {
      // if(this.productSaleOutletTable.tableData[i].status != 'deleted'){
      prodTableData.push({
        productID: this.productSaleOutletTable.tableData[i].productID,
        productName: this.productSaleOutletTable.tableData[i].productName,
        qty: this.productSaleOutletTable.tableData[i].qty,
        costPrice: this.productSaleOutletTable.tableData[i].costPrice,
        salePrice: this.productSaleOutletTable.tableData[i].salePrice,
        invoiceDate: this.productSaleOutletTable.tableData[i].invoiceDate,
        pPriceID: this.productSaleOutletTable.tableData[i].pPriceID,
        outletid: this.productSaleOutletTable.tableData[i].outletid,
        availableqty: this.productSaleOutletTable.tableData[i].availableqty,
        total:
          this.productSaleOutletTable.tableData[i].qty *
          this.productSaleOutletTable.tableData[i].costPrice,

        // locationID: this.productSaleOutletTable.tableData[i].locationID,
        // total: this.productSaleOutletTable.tableData[i].salePrice,
        // status: ''
      });
      // }
    }
    this.formFields[11].value = JSON.stringify(prodTableData);

    if (prodTableData.length == 0) {
      this.valid.apiInfoResponse('enter products');
      return;
    }

    if (this.formFields[7].value == '' || this.formFields[7].value == null) {
      this.valid.apiInfoResponse('enter cash');
      // this.formFields[8].value = 0 - this.lblTotal;
      return;
    }
    if (
      (this.formFields[3].value == '' || this.formFields[3].value == '0') &&
      this.formFields[7].value == 0
    ) {
      this.valid.apiInfoResponse('enter cash');
      return;
    }
    if (this.formFields[3].value == '') {
      var cash =
        parseInt(this.formFields[6].value) + parseInt(this.formFields[7].value);
      if (this.lblTotal > cash) {
        this.valid.apiInfoResponse('enter correct cash');
        return;
      }
    }

    if (this.lblTotal < parseInt(this.formFields[6].value)) {
      this.formFields[6].value =
        parseInt(this.formFields[6].value) - parseInt(this.formFields[8].value);
    }

    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'core-api/OutletSale/saveOutletSales'
      )
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (response.message == 'Success') {
            this.valid.apiInfoResponse('Record saved successfully');

            this.printSaleOutlet.tableData = prodTableData;

            this.printSaleOutlet.lblInvoice = response.invoiceNo;
            this.printSaleOutlet.lblDate = date;
            this.printSaleOutlet.lblGTotal = this.lblTotal;
            this.printSaleOutlet.lblDiscount = this.formFields[6].value;
            this.printSaleOutlet.lblCash = this.lblCash;
            this.printSaleOutlet.lblChange = this.formFields[8].value;

            setTimeout(() => this.globalService.printData(printSection), 200);
            this.reset();
            setTimeout(() => this._txtFocusCode.nativeElement.focus(), 1000);
          } else {
            this.valid.apiErrorResponse(response.toString());
          }
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

  checkSaleReturn() {
    if (this.productSaleOutletTable.tableData.length == 0) {
      this.valid.apiInfoResponse('enter products');
      return;
    }

    $('#saleReturnModal').modal('show');
  }

  saleReturn() {
    this.dataService
      .getHttp('core-api/Sale/getSaleReturn?invoiceNo=' + this.lblInvoiceNo, '')
      .subscribe(
        (response: any) => {
          if (response.length == 0) {
            this.valid.apiInfoResponse('no invoice found');
            return;
          } else {
            let result = this.productSaleOutletTable.tableData.filter(
              (r1: { productID: any; qty: any }) =>
                response.some(
                  (r2: { productID: any; qty: any }) =>
                    r1.productID === r2.productID && r1.qty <= r2.qty
                )
            );

            if (this.productSaleOutletTable.tableData.length == result.length) {
              this.lblCash = this.formFields[7].value;

              this.formFields[4].value = this.lblInvoiceNo;
              this.formFields[5].value = new Date();

              this.formFields[11].value = JSON.stringify(
                this.productSaleOutletTable.tableData
              );

              this.dataService
                .savetHttp(
                  this.pageFields,
                  this.formFields,
                  'core-api/OutletSale/saveOutletSalesReturn'
                )
                .subscribe(
                  (response: any) => {
                    // console.log(response);
                    if (response.message == 'Success') {
                      this.valid.apiInfoResponse('Record saved successfully');

                      this.reset();
                    } else {
                      this.valid.apiErrorResponse(response.toString());
                    }
                  },
                  (error: any) => {
                    this.error = error;
                    this.valid.apiErrorResponse(this.error);
                  }
                );
            } else {
              this.valid.apiErrorResponse('product not found in sale invoice');
              return;
            }
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);

    this.formFields[0].value = '0';
    this.formFields[2].value = '';
    this.formFields[3].value = '0';
    this.formFields[4].value = '0';
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
    this.productSaleOutletTable.tableData = [];
    this.txtCode = '';

    $('#saleReturnModal').modal('hide');
  }

  getKeyPressed(e: any, printSection: string) {
    if (e.keyCode == 13) {
      this.save(printSection);
    }
  }
}
