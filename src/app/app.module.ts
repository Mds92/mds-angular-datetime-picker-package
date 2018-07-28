import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MdsAngularPersianDateTimePickerModule } from 'projects/mds-angular-persian-date-time-picker/src/public_api';
import { AppComponent } from './app.component';

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
