import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { TopnavComponent } from './topnav/topnav.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MaterialModule } from '@aims-pos/material';
import { FooterComponent } from './footer/footer.component';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BachatTopnavComponent } from './bachat-topnav/bachat-topnav.component';
import { BachatSidenavComponent } from './bachat-sidenav/bachat-sidenav.component';
import { BachatFooterComponent } from './bachat-footer/bachat-footer.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

// export const layoutsRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    PerfectScrollbarModule,
  ],
  declarations: [
    FooterComponent,
    SidenavComponent,
    TopnavComponent,
    BachatTopnavComponent,
    BachatSidenavComponent,
    BachatFooterComponent,
  ],
  exports: [
    TopnavComponent,
    SidenavComponent,
    FooterComponent,
    BachatTopnavComponent,
    BachatSidenavComponent,
    BachatFooterComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class LayoutsModule {}
