import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { CategoryInterface, MyFormField } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryTableComponent } from './category-table/category-table.component';

@Component({
  selector: 'aims-pos-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @ViewChild(CategoryTableComponent) categoryTable: any;
  
  pageFields: CategoryInterface = {
    categoryID: '0',
    userID: '',
    categoryName: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.categoryID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.categoryName,
      msg: 'enter category name',
      type: 'name',
      required: true,
    }
  ];
  
  error: any;

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();
  }

  save() {
    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'core-api/Category/saveCategory'
    )
    .subscribe(
      (response: any) => {
        console.log(response);
        if(response.message == 'Success'){
          if(this.formFields[0].value == '0'){
            this.valid.apiInfoResponse('Record saved successfully');
          }else{
            this.valid.apiInfoResponse('Record updated successfully');
          }

          this.categoryTable.getCategory();
          this.reset();
        }else{
          this.valid.apiErrorResponse(response.message.toString());
        }
      },
      (error: any) => {
        this.error = error;
        this.valid.apiErrorResponse(this.error);
      }
    );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    
    this.formFields[0].value = '0';
  }

  edit(item: any){
    this.formFields[0].value = item.categoryID;
    this.formFields[2].value = item.categoryName;
  }

  getKeyPressed(e: any){
    if(e.keyCode == 13){
      this.save();
    }
  }

  delete(item: any){
    this.reset();
  }
}
