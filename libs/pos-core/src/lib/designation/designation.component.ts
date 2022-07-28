import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { DesignationInterface, MyFormField } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DesignationTableComponent } from './designation-table/designation-table.component';

@Component({
  selector: 'aims-pos-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {

  @ViewChild(DesignationTableComponent) designationTable: any;
  
  pageFields: DesignationInterface = {
    designationID: '0',
    userID: '',
    designationName: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.designationID,
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
      value: this.pageFields.designationName,
      msg: 'enter designation name',
      type: 'name',
      required: true,
    },
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
      'core-api/Designation/saveDesignation'
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

          this.designationTable.getDesignation();
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
    this.formFields[0].value = item.designationID;
    this.formFields[2].value = item.desginationName;
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
