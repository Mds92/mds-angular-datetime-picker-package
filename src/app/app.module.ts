import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MdsAngularPersianDateTimePickerModule } from 'projects/mds-angular-persian-date-time-picker/src/lib/mds-angular-persian-date-time-picker.module';

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
