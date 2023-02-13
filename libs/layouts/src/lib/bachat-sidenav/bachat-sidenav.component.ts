import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'aims-pos-bachat-sidenav',
  templateUrl: './bachat-sidenav.component.html',
  styleUrls: ['./bachat-sidenav.component.scss'],
})
export class BachatSidenavComponent implements OnInit {
  @Output() checkRouterUrl = new EventEmitter();

  menuList: any = [
    {
      menuTitle: 'Home',
      parentMenuId: '',
      parentRoute: 'bachat',
      routeTitle: 'main',
      children: [],
    },
    {
      menuTitle: 'Categories',
      parentMenuId: '',
      parentRoute: '',
      routeTitle: 'main',
      children: [
        {
          menuTitle: 'Fruit',
          parentMenuId: '',
          parentRoute: '',
          routeTitle: 'main',
          children: [],
        },
        {
          menuTitle: 'Vegetable',
          parentMenuId: '',
          parentRoute: '',
          routeTitle: 'main',
          children: [],
        },
        {
          menuTitle: 'Sungreen Special',
          parentMenuId: '',
          parentRoute: '',
          routeTitle: 'main',
          children: [],
        },
      ],
    },
    {
      menuTitle: 'About Us',
      parentMenuId: '',
      parentRoute: 'bachat',
      routeTitle: 'aboutus',
      children: [],
    },
    {
      menuTitle: 'Privacy Policy',
      parentMenuId: '',
      parentRoute: 'bachat',
      routeTitle: 'privacypolicy',
      children: [],
    },
  ];

  constructor(private globalService: SharedServicesGlobalDataModule) {}

  ngOnInit(): void {}

  openLink(item: any) {
    if (item.menuTitle == 'Home') {
      this.globalService.setCheckFound(false);
      this.globalService.setAllProductFound(false);
    } else if (
      item.menuTitle == 'Fruit' ||
      item.menuTitle == 'Vegetable' ||
      item.menuTitle == 'Sungreen Special'
    ) {
      this.globalService.setAllProductFound(true);
      this.globalService.setCheckFound(false);
      this.globalService.setWhichProductFound(item.menuTitle);
    }
    this.checkRouterUrl.emit(item.routeTitle);
  }
}
