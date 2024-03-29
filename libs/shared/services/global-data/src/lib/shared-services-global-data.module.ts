import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { SharedServicesAuthModule } from '@aims-pos/shared/services/auth';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import {
  UserInterface,
  ApplicationModuleInterface,
  MenuItemInterface,
} from '@aims-pos/shared/interface';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';

declare var $: any;

@NgModule({
  imports: [CommonModule],
})
export class SharedServicesGlobalDataModule {
  currentUser = {} as UserInterface;

  private subject = new Subject<any>();

  private cart = new Subject<any>();

  private searchProduct = new BehaviorSubject<string>('');
  searchProduct$$ = this.searchProduct.asObservable();

  private checkFound = new BehaviorSubject<boolean>(false);
  checkFound$$ = this.checkFound.asObservable();

  private allProductFound = new BehaviorSubject<boolean>(false);
  allProductFound$$ = this.allProductFound.asObservable();

  private cartQty = new BehaviorSubject<string>('');
  carQty$$ = this.cartQty.asObservable();

  private cartTotal = new BehaviorSubject<string>('0.0');
  cartTotal$$ = this.cartTotal.asObservable();

  private whichProductFound = new BehaviorSubject<string>('');
  whichProductFound$$ = this.whichProductFound.asObservable();

  private _headerTitleSource = new Subject<string>();
  header_title$ = this._headerTitleSource.asObservable();

  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  private openDrawer = new BehaviorSubject<string>('');
  openDrawer$$ = this.openDrawer.asObservable();

  constructor(
    private router: Router,
    private authService: SharedServicesAuthModule,
    private dataService: SharedServicesDataModule
  ) {}

  setOpenDrawer(item: string) {
    this.openDrawer.next(item);
  }

  setSearchProduct(tblSearch: string) {
    this.searchProduct.next(tblSearch);
  }
  setCheckFound(item: boolean): void {
    this.checkFound.next(item);
  }

  setAllProductFound(item: boolean): void {
    this.allProductFound.next(item);
  }

  setWhichProductFound(item: string): void {
    this.whichProductFound.next(item);
  }

  setCartTotal(item: string): void {
    this.cartTotal.next(item);
  }

  setCartQty(item: string): void {
    this.cartQty.next(item);
  }

  setHeaderTitle(title: string) {
    this._headerTitleSource.next(title);
  }

  setLoadingIndicator(value: boolean) {
    this.isLoading$$.next(value);
  }

  getUserId(): number {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      return this.currentUser.userLoginId;
    } else {
      return 0;
    }
  }

  getOutletId(): number {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      return this.currentUser.outletid;
    } else {
      return 0;
    }
  }

  getPinCode(): string {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      return this.currentUser.isPinCode;
    } else {
      return '';
    }
  }

  getUserName(): string {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      return this.currentUser.fullName;
    } else {
      return '';
    }
  }

  getRoleId(): number {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      return this.currentUser.roleId;
    } else {
      return 0;
    }
  }

  setCartItems(item: any) {
    this.cart.next(item);
  }

  getCartItems(): Observable<any> {
    return this.cart.asObservable();
  }
  setMenuItems(item: any) {
    this.subject.next(item);
  }

  getMenuItems(): Observable<any> {
    return this.subject.asObservable();
  }

  checkRouterUrl(listItems: any, routerUrl: any) {
    var pRoute = routerUrl.split('/')[1];
    var cRoute = routerUrl.split('/')[2];

    var row = listItems.filter(
      (m: { parentRoute: any; routeTitle: any }) =>
        m.parentRoute == pRoute && m.routeTitle == cRoute
    );

    if (row.length == 0) {
      this.router.navigate(['/home']);
    } else {
      // console.log(row)
      this.setPermission(row);
    }
  }

  setPermission(item: any) {
    this.subject.next(item);
  }

  getPermission(): Observable<any> {
    return this.subject.asObservable();
  }
  exportExcel(elementName: any, fileName: any) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      document.getElementById(elementName)
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    / save to file /;
    XLSX.writeFile(wb, fileName + '.xlsx');
  }

  //print Asset Register Report
  printData(printSection: string) {
    var contents = $(printSection).html();

    var frame1 = $('<iframe />');
    frame1[0].name = 'frame1';
    frame1.css({ position: 'absolute', top: '-1000000px' });
    $('body').append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
      ? frame1[0].contentDocument.document
      : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    // frameDoc.document.write(
    //   "<html><head><title>DIV Contents</title>" +
    //     "<style>" +
    //     printCss +
    //     "</style>"
    // );

    //Append the external CSS file. <link rel="stylesheet" href="../../../styles.scss" /> <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    frameDoc.document.write(
      '<style type="text/css" media="print">@page { size: portrait; }</style>'
    );
    frameDoc.document.write(
      // '<link rel="stylesheet" href="../../../../../../apps/aims-pos/src/assets/apps/society/src/styles.scss" type="text/scss"  media="print"/>'
      // '<link rel="stylesheet" href="../../../../../ui/src/lib/styles/print/printstyles.css" type="text/css"  media="print"/>'
      // '<link rel="stylesheet" href="../printstyles.css" type="text/css"  media="print"/>'
      '<link rel="stylesheet" href="assets/styles.css" type="text/css" media="print"/>'
      // '<link rel="stylesheet" href="../css/bootstrap.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write('</head><body>');

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');

    frameDoc.document.close();

    setTimeout(function () {
      window.frames[0].focus();
      window.frames[0].print();

      frame1.remove();
    }, 500);
  }

  /****************************** */
  /*********** Text Masks ******* */
  /****************************** */
  cnicMask(): any {
    return [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
    ];
  }

  mobileMask(): any {
    return [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];
  }

  phoneMask(): any {
    return [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  }

  ntnMask(): any {
    return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
  }

  bpsMask(): any {
    return [/\d/, /\d/];
  }
}
