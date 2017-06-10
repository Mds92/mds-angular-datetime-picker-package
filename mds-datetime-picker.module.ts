import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule, MdMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MdsDatetimePickerComponent } from './components/mds-datetime-picker.component';
import { MdsDatetimePickerCoreComponent } from './components/core/mds-datetime-picker-core.component';
import { MdsDatetimePickerResourcesService } from './services/mds-datetime-picker-resources.service';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, MaterialModule, FormsModule, MdMenuModule],
  exports: [MdsDatetimePickerComponent, MdsDatetimePickerCoreComponent],
  declarations: [MdsDatetimePickerComponent, MdsDatetimePickerCoreComponent],
  providers: [MdsDatetimePickerResourcesService]
})
export class MdsDatetimePickerModule { }
