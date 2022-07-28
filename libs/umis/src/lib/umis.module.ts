import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';

import { MaterialModule } from '@aims-pos/material';
import { FormsModule } from '@angular/forms';

export const umisRoutes: Route[] = [
  {path: 'roles', component: RolesComponent},
  {path: 'users', component: UsersComponent},
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(umisRoutes),
    MaterialModule,
    FormsModule,
  ],
  declarations: [
    UsersComponent,
    RolesComponent
  ],
  exports:[
    RouterModule
  ]
})
export class UmisModule {}
