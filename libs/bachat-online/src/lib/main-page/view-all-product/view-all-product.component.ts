import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aims-pos-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.scss'],
})
export class ViewAllProductComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();

  productType: any = '';

  allProductList: any = [];
  tempAllProductList: any = [];

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule
  ) {}

  ngOnInit(): void {
    this.globalService.whichProductFound$$.subscribe(
      (value: any) => ((this.productType = value), this.getOnlineProduct(value))
    );

    this.globalService.searchProduct$$.subscribe((value) => {
      if (value != '') {
        this.allProductList = this.tempAllProductList;

        var fruitData = this.allProductList.filter((x: { productName: any }) =>
          x.productName.toLowerCase().startsWith(value)
        );
        this.allProductList = fruitData;
      } else {
        this.allProductList = this.tempAllProductList;
      }
    });
  }
  getOnlineProduct(item: any) {
    var categoryID = 0;
    if (item == 'Fruit') {
      categoryID = 12;
    } else if (item == 'Vegetable') {
      categoryID = 13;
    } else if (item == 'Sungreen Special') {
      categoryID = 14;
    }
    this.dataService
      .getHttp(
        'bachat-online-api/Product/getAvailProduct?outletID=1&categoryID=' +
          categoryID,
        ''
      )
      .subscribe(
        (response: any) => {
          this.allProductList = [];
          this.tempAllProductList = [];
          for (var i = 0; i < response.length; i++) {
            var img = '';
            if (response[i].applicationedoc == '') {
              img =
                // 'http://135.181.62.60:7060/assets/ui/productPictures/noImage.png';
                'https://image.sungreenfresh.com:7061/assets/ui/productPictures/noImage.png';
            } else {
              img =
                // 'http://135.181.62.60:7060/assets/ui/productPictures/' +
                'https://image.sungreenfresh.com:7061/assets/ui/productPictures/' +
                response[i].productID +
                '.png';
            }
            this.allProductList.push({
              availableqty: response[i].availableqty,
              costPrice: response[i].costPrice,
              invoiceDate: response[i].invoiceDate,
              outletid: response[i].outletid,
              pPriceID: response[i].pPriceID,
              productID: response[i].productID,
              productName: response[i].productName,
              salePrice: response[i].salePrice,
              categoryID: response[i].categoryID,
              categoryName: response[i].categoryName,
              imgUrl: img,
              qty: 1,
            });

            this.tempAllProductList.push({
              availableqty: response[i].availableqty,
              costPrice: response[i].costPrice,
              invoiceDate: response[i].invoiceDate,
              outletid: response[i].outletid,
              pPriceID: response[i].pPriceID,
              productID: response[i].productID,
              productName: response[i].productName,
              categoryID: response[i].categoryID,
              categoryName: response[i].categoryName,
              salePrice: response[i].salePrice,
              imgUrl: img,
              qty: 1,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  pushCartItem(item: any) {
    this.eventEmitter.emit(item);
  }
}
