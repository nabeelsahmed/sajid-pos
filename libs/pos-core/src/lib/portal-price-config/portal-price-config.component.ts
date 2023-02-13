import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-portal-price-config',
  templateUrl: './portal-price-config.component.html',
  styleUrls: ['./portal-price-config.component.scss'],
})
export class PortalPriceConfigComponent implements OnInit {
  lblOutletName: any = '';

  cmbOutlet: any = '';
  tblSearch: any = '';

  error: any;

  outletList: any = [];
  tableData: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.getOutlet();
    this.getProduct();
  }

  getOutlet() {
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe(
      (response: any) => {
        this.outletList = response;
        var data = response.filter((x: { outletID: any }) => x.outletID == 1);
        this.lblOutletName = data[0].outletName;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getProduct() {
    this.dataService
      .getHttp('bachat-online-api/Product/getPortalAvailProduct?outletID=1', '')
      .subscribe(
        (response: any) => {
          // this.productList = response;
          console.log(response);
          this.tableData = [];
          for (var i = 0; i < response.length; i++) {
            var img = '';
            if (response[i].applicationedoc == '') {
              // img = "http://135.181.62.34:7060/assets/ui/productPictures/noImage.png";
              img =
                'https://image.sungreenfresh.com:7061/assets/ui/productPictures/noImage.png';
            } else {
              // img = "http://135.181.62.34:7060/assets/ui/productPictures/" + response[i].productID + ".png";
              img =
                'https://image.sungreenfresh.com:7061/assets/ui/productPictures/' +
                response[i].productID +
                '.png';
            }
            this.tableData.push({
              availableqty: response[i].availableqty,
              costPrice: response[i].costPrice,
              invoiceDate: response[i].invoiceDate,
              outletid: response[i].outletid,
              pPriceID: response[i].pPriceID,
              productID: response[i].productID,
              productName: response[i].productName,
              salePrice: response[i].salePrice,
              imgUrl: img,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  save(item: any) {
    var pageFields = {
      pPriceID: '0',
      userID: '',
      availableqty: '',
      salePrice: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.pPriceID,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.userID,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.availableqty,
        msg: 'enter aavailable quantity',
        type: 'textbox',
        required: false,
      },
      {
        value: pageFields.salePrice,
        msg: 'enter sale price',
        type: 'textbox',
        required: true,
      },
    ];

    formFields[0].value = item.pPriceID;
    formFields[1].value = this.globalService.getUserId().toString();
    formFields[2].value = item.availableqty;
    formFields[3].value = item.salePrice;

    // console.log(formFields)
    // return;
    this.dataService
      .savetHttp(pageFields, formFields, 'core-api/Sale/savePortalPrice')
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (response.message == 'Success') {
            this.valid.apiInfoResponse('Record saved successfully');

            this.tblSearch = '';
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
}
