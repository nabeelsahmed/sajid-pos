import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchfilterPipe } from './pipe-filter/searchfilter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    SearchfilterPipe
  ],
})
export class SharedInterfaceModule {}
