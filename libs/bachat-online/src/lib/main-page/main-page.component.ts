import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { environment } from 'apps/sajid-pos/src/environments/environment';
import { ViewAllProductComponent } from './view-all-product/view-all-product.component';
declare var $: any;
@Component({
  selector: 'aims-pos-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  @Output() public drawerToggle = new EventEmitter();
  @ViewChild(ViewAllProductComponent) viewAllProd: any;

  checkoutFound: any;

  menu_btn: any = 'menu';
  txtSearch: any = '';
  total: any = 0;
  cartList: any = [];
  tempImg = '../assets/ui/productPictures/noImage.png';
  items: any;
  totalPrice: any = 0.0;

  fruitList: any = [];
  vegetableList: any = [];
  specialList: any = [];
  productList: any = [];
  tempProductList: any = [];

  viewProduct: any = false;
  found = false;
  index = 0;

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.total = 0;
    this.globalService.setCartQty(this.cartList.length);
    // this.globalService.setCartTotal(this.total);
    this.globalService.checkFound$$.subscribe(
      (value) => (this.checkoutFound = value)
    );

    this.globalService.allProductFound$$.subscribe(
      (value) => (this.viewProduct = value)
    );

    this.getOnlineProduct();

    this.globalService.searchProduct$$.subscribe((value) => {
      if (value != '') {
        // alert(this.tempProductList.length);
        // alert(this.productList.length);

        this.fruitList = this.productList.filter(
          (x: { categoryID: any }) => x.categoryID == 12
        );
        this.vegetableList = this.productList.filter(
          (x: { categoryID: any }) => x.categoryID == 13
        );
        this.specialList = this.productList.filter(
          (x: { categoryID: any }) => x.categoryID == 14
        );

        var fruitData = this.fruitList.filter((x: { productName: any }) =>
          x.productName.toLowerCase().startsWith(value)
        );
        this.fruitList = fruitData;

        var vegetableData = this.vegetableList.filter(
          (x: { productName: any }) =>
            x.productName.toLowerCase().startsWith(value)
        );
        this.vegetableList = vegetableData;

        var specialData = this.specialList.filter((x: { productName: any }) =>
          x.productName.toLowerCase().startsWith(value)
        );
        this.specialList = specialData;
      } else {
        this.fruitList = this.productList.filter(
          (x: { categoryID: any }) => x.categoryID == 12
        );
        this.vegetableList = this.productList.filter(
          (x: { categoryID: any }) => x.categoryID == 13
        );
        this.specialList = this.productList.filter(
          (x: { categoryID: any }) => x.categoryID == 14
        );
      }
    });
  }

  activeClass() {
    $('#activeBtn').removeClass('activeButton');
    $('#smActiveBtn').removeClass('smActiveButton');

    $('#activeBtn').addClass('portalButton');
    $('#smActiveBtn').addClass('smPortalButton');
  }

  smActiveClass() {
    $('#smActiveBtn').removeClass('smActiveButton');
    $('#activeBtn').removeClass('activeButton');

    $('#smActiveBtn').addClass('smPortalButton');
    $('#activeBtn').addClass('portalButton');
  }

  getOnlineProduct() {
    this.dataService
      .getHttp('bachat-online-api/Product/getAvailProduct?outletID=1', '')
      .subscribe(
        (response: any) => {
          this.productList = [];
          this.tempProductList = [];
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
            this.productList.push({
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

            this.tempProductList.push({
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

          this.fruitList = this.productList.filter(
            (x: { categoryID: any }) => x.categoryID == 12
          );
          this.vegetableList = this.productList.filter(
            (x: { categoryID: any }) => x.categoryID == 13
          );
          this.specialList = this.productList.filter(
            (x: { categoryID: any }) => x.categoryID == 14
          );
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  filterProductData(val: any) {
    this.productList = this.tempProductList;
    if (val == '2') {
      this.productList = this.productList.filter(
        (x: { categoryID: any }) => x.categoryID == 12
      );
    } else if (val == '3') {
      this.productList = this.productList.filter(
        (x: { categoryID: any }) => x.categoryID == 13
      );
    } else if (val == '4') {
      this.productList = this.productList.filter(
        (x: { categoryID: any }) => x.categoryID == 14
      );
    }
  }

  addCartItem(item: any) {
    // return;
    item.qty = parseInt(item.qty) + 1;

    if (this.cartList.length > 0) {
      this.found = false;
      this.index = 0;
      for (var i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].pPriceID == item.pPriceID) {
          this.found = true;
          this.index = i;
          i = this.cartList.length + 1;
        }
      }
      if (this.found == true) {
        this.dataService
          .getHttp(
            'bachat-online-api/Product/getCheckQty?pPriceID=' +
              item.pPriceID +
              '&qty=' +
              item.qty,
            ''
          )
          .subscribe(
            (response: any) => {
              if (response['msg'] == true) {
                this.cartList[this.index].qty = parseInt(item.qty);

                this.total = 0;
                for (var i = 0; i < this.cartList.length; i++) {
                  this.total =
                    parseInt(this.total) +
                    parseInt(this.cartList[i].qty) *
                      parseInt(this.cartList[i].salePrice);
                }
                var qty = 0;
                for (var i = 0; i < this.cartList.length; i++) {
                  qty = qty + parseInt(this.cartList[i].qty);
                }
                this.globalService.setCartQty(qty.toString());
                this.globalService.setCartTotal(this.total);
                this.items = qty;
                this.totalPrice = this.total;
              } else {
                this.valid.apiErrorResponse(
                  'only ' + response['qty'] + ' items available in stock'
                );

                item.qty = response['qty'];
              }
            },
            (error: any) => {
              console.log(error);
            }
          );
      }
    }
  }

  removeCartItem(item: any) {
    if (item.qty > 0) {
      item.qty = parseInt(item.qty) - 1;
    }
    if (this.cartList.length > 0) {
      this.total = parseInt(this.total) - parseInt(item.salePrice);

      if (item.qty == 0) {
        this.found = false;
        this.index = 0;
        for (var i = 0; i < this.cartList.length; i++) {
          if (this.cartList[i].pPriceID == item.pPriceID) {
            this.found = true;
            this.index = i;
            i = this.cartList.length + 1;
          }
        }
        if (this.found == true) {
          this.cartList.splice(this.index, 1);
        }
      }
    }

    this.total = 0;
    for (var i = 0; i < this.cartList.length; i++) {
      this.total =
        parseInt(this.total) +
        parseInt(this.cartList[i].qty) * parseInt(this.cartList[i].salePrice);
    }

    if (this.cartList.length == 0) {
      $('#cartModal').modal('hide');
    }

    var qty = 0;
    for (var i = 0; i < this.cartList.length; i++) {
      qty = qty + parseInt(this.cartList[i].qty);
    }
    this.globalService.setCartQty(qty.toString());
    this.globalService.setCartTotal(this.total);
    this.items = qty;
    this.totalPrice = this.total;
  }

  removeProduct(index: any) {
    this.total -=
      parseInt(this.cartList[index].qty) *
      parseInt(this.cartList[index].salePrice);

    this.items -= parseInt(this.cartList[index].qty);
    this.cartList.splice(index, 1);
  }

  pushCartItem(item: any) {
    this.dataService
      .getHttp(
        'bachat-online-api/Product/getCheckQty?pPriceID=' +
          item.pPriceID +
          '&qty=' +
          item.qty,
        ''
      )
      .subscribe(
        (response: any) => {
          if (response['msg'] == true) {
            if (this.cartList.length == 0) {
              this.cartList.push({
                imgUrl: item.imgUrl,
                pPriceID: item.pPriceID,
                productID: item.productID,
                productName: item.productName,
                salePrice: item.salePrice,
                qty: item.qty,
                availQty: item.availableqty,
              });

              this.total = parseInt(item.salePrice) * parseInt(item.qty);

              $('#cartModal').modal('show');
            } else {
              this.found = false;
              this.index = 0;

              for (var i = 0; i < this.cartList.length; i++) {
                if (this.cartList[i].pPriceID == item.pPriceID) {
                  this.found = true;
                  this.index = i;
                  i = this.cartList.length + 1;
                }
              }

              if (this.found == true) {
                if (
                  parseInt(this.cartList[this.index].qty) >= parseInt(item.qty)
                ) {
                  this.cartList[this.index].qty =
                    parseInt(this.cartList[this.index].qty) +
                    parseInt(item.qty);
                  // (parseInt(this.cartList[this.index].qty) -
                  // );
                  // } else if (
                  //   parseInt(this.cartList[this.index].qty) < parseInt(item.qty)
                  // ) {
                  //   this.cartList[this.index].qty =
                  //     parseInt(this.cartList[this.index].qty) +
                  //     (parseInt(item.qty) -
                  //       parseInt(this.cartList[this.index].qty));
                }
              } else {
                this.cartList.push({
                  imgUrl: item.imgUrl,
                  pPriceID: item.pPriceID,
                  productID: item.productID,
                  productName: item.productName,
                  salePrice: item.salePrice,
                  qty: item.qty,
                  availQty: item.availableqty,
                });
              }

              this.total = 0;
              for (var i = 0; i < this.cartList.length; i++) {
                this.total =
                  parseInt(this.total) +
                  parseInt(this.cartList[i].qty) *
                    parseInt(this.cartList[i].salePrice);
              }
            }

            var qty = 0;
            for (var i = 0; i < this.cartList.length; i++) {
              qty = qty + parseInt(this.cartList[i].qty);
            }
            this.globalService.setCartQty(qty.toString());
            this.globalService.setCartTotal(this.total);
            this.items = qty;
            this.totalPrice = this.total;
          } else {
            this.valid.apiErrorResponse(
              'only ' + response['qty'] + ' items available in stock'
            );
            item.qty = response['qty'];
          }
          this.cartList.reverse();
          // $('#cartModal').modal('show');
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  checkout() {
    if (this.cartList.length == 0) {
      this.valid.apiInfoResponse('no item in cart');
    } else {
      $('#cartModal').modal('hide');
      this.checkoutFound = true;
      this.viewProduct = false;
      this.globalService.setCheckFound(true);
      this.globalService.setAllProductFound(false);
    }
  }

  /***************scroll fruit functions ****************/
  scrollFruitLeft() {
    var left = document.querySelector('.scroll-fruit');
    left?.scrollBy(350, 0);
  }

  scrollFruitRight() {
    var right = document.querySelector('.scroll-fruit');
    right?.scrollBy(-350, 0);
  }

  scrollSmFruitLeft() {
    var left = document.querySelector('.sm-scroll-fruit');
    left?.scrollBy(275, 0);
  }

  scrollSmFruitRight() {
    var right = document.querySelector('.sm-scroll-fruit');
    right?.scrollBy(-275, 0);
  }

  /****************scroll vegetable function*************/

  scrollVegetableLeft() {
    var left = document.querySelector('.scroll-vegetable');
    left?.scrollBy(350, 0);
  }

  scrollVegetableRight() {
    var right = document.querySelector('.scroll-vegetable');
    right?.scrollBy(-350, 0);
  }

  scrollSmVegetableLeft() {
    var left = document.querySelector('.sm-scroll-vegetable');
    left?.scrollBy(275, 0);
  }

  scrollSmVegetableRight() {
    var right = document.querySelector('.sm-scroll-vegetable');
    right?.scrollBy(-275, 0);
  }

  /***************scroll special function ****************/
  scrollSpecialLeft() {
    var left = document.querySelector('.scroll-special');
    left?.scrollBy(350, 0);
  }

  scrollSpecialRight() {
    var right = document.querySelector('.scroll-special');
    right?.scrollBy(-350, 0);
  }

  scrollSmSpecialLeft() {
    var left = document.querySelector('.sm-scroll-special');
    left?.scrollBy(275, 0);
  }

  scrollSmSpecialRight() {
    var right = document.querySelector('.sm-scroll-special');
    right?.scrollBy(-275, 0);
  }

  openModal() {
    // alert('ok');
    // alert(this.totalPrice);
    if (this.cartList.length > 0) {
      $('#cartModal').modal('show');
    }
  }

  resetCart() {
    this.cartList = [];
    this.items = '';
  }

  onToggleDrawer() {
    this.drawerToggle.emit();

    this.globalService.setOpenDrawer('open');

    if (this.menu_btn == 'menu') {
      this.menu_btn = 'menu_open';
    } else if (this.menu_btn == 'menu_open') {
      this.menu_btn = 'menu';
    }
  }

  viewAllProduct(item: any) {
    this.globalService.setAllProductFound(true);
    this.globalService.setWhichProductFound(item);
  }
}
