import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdsAngularPersianDateTimePickerCoreComponent } from './core/mds-angular-persian-date-time-picker-core.component';
import { MdsAngularPersianDateTimePickerComponent } from './mds-angular-persian-date-time-picker.component';
import { PersianNumberPipe } from './pipes/persian-number.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  imports: [
    CommonModule, BrowserModule, BrowserAnimationsModule,
    MatFormFieldModule, MatButtonModule,
    MatGridListModule,  FormsModule,
  ],
  declarations: [
    MdsAngularPersianDateTimePickerCoreComponent,
    MdsAngularPersianDateTimePickerComponent, SafeHtmlPipe, PersianNumberPipe],
  exports: [
    MdsAngularPersianDateTimePickerComponent
  ]
})
export class MdsAngularPersianDateTimePickerModule { }
