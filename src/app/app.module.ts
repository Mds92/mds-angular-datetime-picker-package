import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MdsAngularPersianDateTimePickerModule } from 'projects/mds-angular-persian-date-time-picker/src/lib/mds-angular-persian-date-time-picker.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule, FormsModule, ReactiveFormsModule,
    MdsAngularPersianDateTimePickerModule, 
  ],
  providers: [],  
  bootstrap: [AppComponent]
})
export class AppModule { }
