import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MdsAngularPersianDateTimePickerModule } from 'MdsAngularPersianDateTimePicker/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MdsAngularPersianDateTimePickerModule, 
  ],
  providers: [],  
  bootstrap: [AppComponent]
})
export class AppModule { }
