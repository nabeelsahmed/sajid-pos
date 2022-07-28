import { SharedHelpersFieldValidationsModule } from '@aims-pos/shared/helpers/field-validations';
import { MyFormField } from '@aims-pos/shared/interface';
import { SharedServicesDataModule } from '@aims-pos/shared/services/data';
import { SharedServicesGlobalDataModule } from '@aims-pos/shared/services/global-data';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'aims-pos-outlet-table',
  templateUrl: './outlet-table.component.html',
  styleUrls: ['./outlet-table.component.scss']
})
export class OutletTableComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterDelete = new EventEmitter();

  tableData: any = [];

  error: any;

  constructor(
    private dataService: SharedServicesDataModule,
    private globalService: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.getOutlet();
  }

  getOutlet(){
    this.dataService.getHttp('cmis-api/Outlet/getOutlet', '').subscribe((response: any) => {
      this.tableData = response;
    }, (error: any) => {
      console.log(error);
    });
  }
  
  edit(item: any){
    this.eventEmitter.emit(item);
  }

  delete(item: any){
    this.eventEmitterDelete.emit(item);
    
    var pageFields = {
      outletID: '0',
      userID: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.outletID,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.userID,
        msg: '',
        type: 'hidden',
        required: false,
      },
    ];

    formFields[0].value = item.outletID;
    formFields[1].value = this.globalService.getUserId().toString();

    this.dataService
      .deleteHttp(
        pageFields,
        formFields,
        'cmis-api/Outlet/deleteOutlet'
      )
      .subscribe(
        (response: any) => {
          if(response.message == "Success"){
            this.valid.apiInfoResponse('Record deleted successfully');
            this.getOutlet();
          }else{
            this.valid.apiErrorResponse(response[0]);
          }
          
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

}
