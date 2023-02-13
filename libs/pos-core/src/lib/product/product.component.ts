import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { ProductTableComponent } from './product-table/product-table.component';
import { MyFormField, ProductInterface } from '@aims-pos/shared/interface';
import { ProductImageUploadingComponent } from './product-image-uploading/product-image-uploading.component';
import { environment } from 'apps/sajid-pos/src/environments/environment';

@Component({
  selector: 'aims-pos-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @ViewChild(ProductTableComponent) productTable: any;
  @ViewChild(ProductImageUploadingComponent) imageUpload: any;

  searchParentProduct: any = '';

  cmbBarcode: any;
  cmbCategory: any;
  cmbSubCategory: any;

  pageFields: ProductInterface = {
    productID: '0', //0
    userID: '', //1
    categoryID: '0', //2
    productName: '', //3
    productNameUrdu: '', //4
    brandID: '0', //5
    locationID: '0', //6
    barcode1: '', //7
    barcode2: '', //8
    barcode3: '', //9
    quickSale: '', //10
    colorID: '', //11
    sizeID: '', //12
    costPrice: '', //13
    salePrice: '', //14
    retailPrice: '', //15
    wholeSalePrice: '', //16
    reOrderLevel: '', //17
    maxLimit: '', //18
    gst: '', //19
    et: '', //20
    packingQty: '', //21
    packingSalePrice: '', //22
    uomID: '0', //23
    pctCode: '', //24
    barcodeID: '0', //25
    pPriceID: '0', //26
    applicationEDocPath: '', //27
    applicationEDoc: '', //28
    applicationEdocExtenstion: '', //29
    parentProductID: '', //30
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.productID,
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
      value: this.pageFields.categoryID,
      msg: 'select category',
      type: 'selectBox',
      required: false,
    },
    {
      value: this.pageFields.productName,
      msg: 'enter product name',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.productNameUrdu,
      msg: 'enter product name urdu',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.brandID,
      msg: 'enter brand',
      type: 'selectBox',
      required: false,
    },
    {
      value: this.pageFields.locationID,
      msg: 'select location',
      type: 'selectBox',
      required: false,
    },
    {
      value: this.pageFields.barcode1,
      msg: 'enter barcode',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.barcode2,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.barcode3,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.quickSale,
      msg: 'select quick sale',
      type: 'selectBox',
      required: true,
    },
    {
      value: this.pageFields.colorID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.sizeID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.costPrice,
      msg: 'enter cost price',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.salePrice,
      msg: 'enter sale price',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.retailPrice,
      msg: 'enter retail price',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.wholeSalePrice,
      msg: 'enter whole sale price',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.reOrderLevel,
      msg: 'enter re-order level',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.maxLimit,
      msg: 'enter max limit',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.gst,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.et,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.packingQty,
      msg: 'enter packing',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.packingSalePrice,
      msg: 'enter packing sale price',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.uomID,
      msg: 'select measurement unit',
      type: 'selectBox',
      required: true,
    },
    {
      value: this.pageFields.pctCode,
      msg: '',
      type: 'textBox',
      required: false,
    },
    {
      value: this.pageFields.barcodeID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.pPriceID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.applicationEDocPath,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.applicationEDoc,
      msg: 'select membership document',
      type: 'File',
      required: false,
    },
    {
      value: this.pageFields.applicationEdocExtenstion,
      msg: '',
      type: 'textbox',
      required: false,
    },
    {
      value: this.pageFields.parentProductID,
      msg: '',
      type: 'selectbox',
      required: false,
    },
  ];

  productPic: any;
  tabIndex = 0;
  error: any;

  brandList: any = [];
  categoryList: any = [];
  subCategoryList: any = [];
  locationList: any = [];
  uomList: any = [];
  parentProductList: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    // this.globalService.setHeaderTitle("Product");
    this.formFields[1].value = this.globalService.getUserId().toString();
    this.productPic =
      'https://icons.veryicon.com/png/o/application/applet-1/product-17.png';

    this.formFields[10].value = 'no';
    this.formFields[21].value = 1;
    this.formFields[24].value = '-';
    this.formFields[19].value = 0;
    this.formFields[20].value = 0;
    this.formFields[5].value = 0;
    this.formFields[5].value = 0;

    this.formFields[23].value = 4;

    this.cmbBarcode = 1;
    this.cmbCategory = 1;
    this.getSubCategory(1);

    this.getBrand();
    this.getCategory();
    this.getLocation();
    this.getUOM();
    this.getParentProduct();
  }

  getParentProduct() {
    this.dataService.getHttp('core-api/Product/getProductParent', '').subscribe(
      (response: any) => {
        this.parentProductList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getBrand() {
    this.dataService.getHttp('core-api/Brand/getBrand', '').subscribe(
      (response: any) => {
        this.brandList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCategory() {
    this.dataService.getHttp('core-api/Category/getCategory', '').subscribe(
      (response: any) => {
        this.categoryList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getLocation() {
    this.dataService.getHttp('core-api/Location/getLocation', '').subscribe(
      (response: any) => {
        this.locationList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getUOM() {
    this.dataService.getHttp('core-api/UOM/getMeasurementUnit', '').subscribe(
      (response: any) => {
        this.uomList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getSubCategory(item: any) {
    this.dataService
      .getHttp('core-api/Category/getSubCategory?catID=' + item, '')
      .subscribe(
        (response: any) => {
          this.subCategoryList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  save() {
    // this.formFields[15].value = (this.formFields[11].value / this.formFields[10].value);

    this.formFields[5].value = '0';
    // if(this.cmbSubCategory == '' || this.cmbSubCategory == undefined){
    //   this.formFields[2].value = this.cmbCategory;
    // }else{
    //   this.formFields[2].value = this.cmbSubCategory;
    // }

    if (this.cmbBarcode == 2) {
      if (
        this.formFields[7].value == '' &&
        this.formFields[8].value == '' &&
        this.formFields[9].value == ''
      ) {
        this.valid.apiInfoResponse('please enter barcode');
        return;
      }
    }

    if (this.formFields[6].value == '') {
      this.formFields[6].value = '0';
    }
    if (this.formFields[11].value == '') {
      this.formFields[11].value = '0';
    }
    if (this.formFields[12].value == '') {
      this.formFields[12].value = '0';
    }
    if (this.formFields[13].value == '') {
      this.formFields[13].value = '0';
    }
    if (this.formFields[14].value == '') {
      this.formFields[14].value = '0';
    }
    if (this.formFields[15].value == '') {
      this.formFields[15].value = '0';
    }
    if (this.formFields[16].value == '') {
      this.formFields[16].value = '0';
    }
    if (this.formFields[17].value == '') {
      this.formFields[17].value = '0';
    }
    if (this.formFields[18].value == '') {
      this.formFields[18].value = '0';
    }
    if (this.formFields[20].value == '') {
      this.formFields[20].value = '0';
    }
    if (this.formFields[22].value == '') {
      this.formFields[22].value = '0';
    }
    if (this.formFields[25].value == '') {
      this.formFields[25].value = '0';
    }
    if (this.formFields[26].value == '') {
      this.formFields[26].value = '0';
    }
    if (this.formFields[30].value == '') {
      this.formFields[30].value = '0';
    }

    this.formFields[27].value = this.imageUpload.image;
    this.formFields[29].value = this.imageUpload.imageExt;

    if (
      this.formFields[27].value != undefined &&
      this.formFields[27].value != ''
    ) {
      this.formFields[28].value = environment.imageUrl + 'productPictures';
      // 'D:/logix/SocietyProject/Society/libs/ui/src/lib/assets/images/memberPictures';
    } else {
      this.formFields[29].value = '';
      this.formFields[27].value = '';
      this.formFields[28].value = '';
    }
    if (this.formFields[0].value == '0') {
      this.dataService
        .savetHttp(
          this.pageFields,
          this.formFields,
          'core-api/Product/saveProduct'
        )
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.message == 'Success') {
              this.valid.apiInfoResponse('Record saved successfully');

              this.productTable.getProduct();
              this.reset();
            } else {
              this.valid.apiErrorResponse(response.message.toString());
            }
          },
          (error: any) => {
            this.error = error;
            this.valid.apiErrorResponse(this.error);
          }
        );
    } else {
      this.dataService
        .savetHttp(
          this.pageFields,
          this.formFields,
          'core-api/Product/updateProduct'
        )
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.message == 'Success') {
              this.valid.apiInfoResponse('Record updated successfully');

              this.productTable.getProduct();
              this.reset();
            } else {
              this.valid.apiErrorResponse(response.message.toString());
            }
          },
          (error: any) => {
            this.error = error;
            this.valid.apiErrorResponse(this.error);
          }
        );
    }
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);

    this.cmbBarcode = 1;
    // this.cmbCategory = '';
    this.cmbSubCategory = '';
    this.subCategoryList = [];

    this.formFields[0].value = '0';
    this.formFields[2].value = '';
    this.formFields[7].value = '';
    this.formFields[8].value = '';
    this.formFields[9].value = '';
    this.formFields[10].value = 'no';
    this.formFields[19].value = 0;
    this.formFields[20].value = 0;
    this.formFields[21].value = 1;
    this.formFields[22].value = '0';
    this.formFields[13].value = '0';
    this.formFields[14].value = '0';

    this.formFields[23].value = 4;

    this.formFields[27].value = '';
    this.formFields[29].value = '';
    this.formFields[28].value = '';
    this.formFields[30].value = '';

    this.productPic = '';
    this.imageUpload.imageUrl = '';
    this.imageUpload.image = '';
    this.searchParentProduct = '';
    // this.selec

    this.getSubCategory(1);
  }

  edit(item: any) {
    console.log(item);

    this.tabIndex = 0;

    this.formFields[0].value = item.productID;
    this.formFields[30].value = item.parentProductID;
    this.formFields[2].value = item.categoryID;

    this.formFields[3].value = item.productName;
    // this.formFields[4].value = item.productNameUrdu;

    // this.formFields[5].value = item.brandID;
    // this.formFields[6].value = item.locationID;

    if (item.barcode1 != 'null') {
      this.formFields[7].value = item.barcode1;
    }
    if (item.barcode2 != 'null') {
      this.formFields[8].value = item.barcode2;
    }
    if (item.barcode3 != 'null') {
      this.formFields[9].value = item.barcode3;
    }

    if (
      item.barcode1 != 'null' ||
      item.barcode2 != 'null' ||
      item.barcode3 != 'null'
    ) {
      this.cmbBarcode = 2;
    }

    this.formFields[10].value = item.quickSale;

    // this.formFields[11].value = item.colorID;
    // this.formFields[12].value = item.sizeID;
    // this.formFields[13].value = item.costPrice;
    // this.formFields[14].value = item.salePrice;
    // this.formFields[15].value = item.retailPrice;
    // this.formFields[16].value = item.wholeSalePrice;
    // this.formFields[17].value = item.rol;
    // this.formFields[18].value = item.maxLimit;
    // this.formFields[19].value = item.gst;
    // this.formFields[20].value = item.et;
    // this.formFields[21].value = item.packing;
    // this.formFields[22].value = item.packingSalePrice;
    this.formFields[23].value = item.uomID;
    // this.formFields[24].value = item.pctCode;
    this.formFields[25].value = item.barcodeID;
    // this.formFields[26].value = item.pPriceID;
    // this.cmbCategory = item.parentCategoryID;

    if (item.applicationedoc != '') {
      this.productPic =
        // 'http://135.181.62.34:7060/assets/ui/productPictures/' +
        'https://image.sungreenfresh.com:7061/assets/ui/productPictures/' +
        item.productID +
        '.png';
    }
    // if(item.parentCategoryID != 0){
    //   this.getSubCategory(item.parentCategoryID);
    //   this.cmbCategory = item.parentCategoryID;
    //   this.cmbSubCategory = item.categoryID;
    // }else{
    //   this.cmbCategory = item.categoryID;
    // }
    // this.formFields[12].value = item.parentLocationID;
  }

  changeTabHeader(tabNum: any) {
    this.tabIndex = tabNum;
  }

  getKeyPressed(e: any) {
    if (e.keyCode == 13) {
      this.save();
    }
  }

  delete(item: any) {
    this.reset();
  }
}
