import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { MaterialModule } from '@aims-pos/material';
import { FormsModule } from '@angular/forms';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { TextMaskModule } from 'angular2-text-mask';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MainPageComponent } from './main-page/main-page.component';
import { CheckoutComponent } from './main-page/checkout/checkout.component';
import { LayoutsModule } from '@aims-pos/layouts';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ViewAllProductComponent } from './main-page/view-all-product/view-all-product.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

export const bachatOnlineRoutes: Route[] = [
  { path: 'main', component: MainPageComponent },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },
  { path: '**', redirectTo: 'main', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(bachatOnlineRoutes),
    RouterModule,
    PerfectScrollbarModule,
    LayoutsModule,
    TextMaskModule,
    Ng2SearchPipeModule,
  ],
  declarations: [
    MainPageComponent,
    CheckoutComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    ViewAllProductComponent,
  ],
  exports: [CheckoutComponent, ViewAllProductComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class BachatOnlineModule {}
