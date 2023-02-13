import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aims-pos-bachat-footer',
  templateUrl: './bachat-footer.component.html',
  styleUrls: ['./bachat-footer.component.scss'],
})
export class BachatFooterComponent implements OnInit {
  constructor(private globalService: SharedServicesGlobalDataModule) {}

  ngOnInit(): void {}

  openLink(item: any) {
    if (item == 'Fruit' || item == 'Vegetable' || item == 'Sungreen Special') {
      this.globalService.setAllProductFound(true);
      this.globalService.setCheckFound(false);
      this.globalService.setWhichProductFound(item);
    }
  }
}
