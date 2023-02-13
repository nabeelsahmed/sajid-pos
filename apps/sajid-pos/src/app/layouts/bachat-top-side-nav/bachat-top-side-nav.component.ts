import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'aims-pos-bachat-top-side-nav',
  templateUrl: './bachat-top-side-nav.component.html',
  styleUrls: ['./bachat-top-side-nav.component.scss'],
})
export class BachatTopSideNavComponent implements OnInit {
  @ViewChild('element', { static: true }) element: ElementRef;

  isScrolled = false;
  checkoutFound: any;

  txtSearch: any = '';
  items: any;

  routerUrl: any = '';

  menu_btn: any = 'menu';
  constructor(
    private globalService: SharedServicesGlobalDataModule,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.globalService.carQty$$.subscribe((value) => (this.items = value));
    this.globalService.checkFound$$.subscribe(
      (value) => (this.checkoutFound = value)
    );

    this.routerUrl = this.router.url;
  }

  // @HostListener('ps-scroll-y', [])
  // onWindowScroll() {
  //   const header = document.querySelector('#header') as HTMLElement;
  //   alert(this.isScrolled);

  //   if (window.pageYOffset > 0) {
  //     this.isScrolled = true;
  //   } else {
  //     this.isScrolled = false;
  //   }
  // }

  openModal() {
    if (this.items > 0) {
      $('#cartModal').modal('show');
    }
  }

  searchProductData(item: any) {
    this.globalService.setSearchProduct(item);
  }

  checkRouterUrl(item: any) {
    this.routerUrl = '/bachat/' + item;
  }
}
