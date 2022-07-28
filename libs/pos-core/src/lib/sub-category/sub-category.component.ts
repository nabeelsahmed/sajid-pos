import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField, SubCategoryInterface } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SubCategoryTableComponent } from './sub-category-table/sub-category-table.component';

@Component({
  selector: 'aims-pos-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  @ViewChild(SubCategoryTableComponent) subCategoryTable: any;
  
  pageFields: SubCategoryInterface = {
    categoryID: '0',
    userID: '',
    parentCategoryID: '0',
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
      value: this.pageFields.parentCategoryID,
      msg: 'select category',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.categoryName,
      msg: 'enter sub category name',
      type: 'name',
      required: true,
    }
  ];
  
  categoryList: any = [];
  error: any;

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[1].value = this.globalService.getUserId().toString();

    this.getCategory();
  }

  getCategory() {
    this.dataService.getHttp('core-api/Category/getCategory', '').subscribe(
      (response: any) => {
        this.categoryList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save() {
    this.dataService
    .savetHttp(
      this.pageFields,
      this.formFields,
      'core-api/Category/saveSubCategory'
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

          this.subCategoryTable.getSubCategory();
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
    // console.log(item);return;
    this.formFields[0].value = item.categoryID;
    this.formFields[2].value = item.parentCategoryID;
    this.formFields[3].value = item.categoryName;
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
