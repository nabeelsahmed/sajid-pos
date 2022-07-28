import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { MaterialModule } from '@aims-pos/material';
import { FormsModule } from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { OutletComponent } from './outlet/outlet.component';
import { OutletTableComponent } from './outlet/outlet-table/outlet-table.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

export const cmisRoutes: Route[] = [
  { path: 'outlet', component: OutletComponent },
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(cmisRoutes),
    MaterialModule,
    FormsModule,
    PerfectScrollbarModule,
    TextMaskModule
  ],
  exports:[
    RouterModule,
    OutletTableComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  declarations: [
    OutletComponent,
    OutletTableComponent,
  ],
})
export class CmisModule {}
