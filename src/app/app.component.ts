import { Component } from '@angular/core';
import { IMdsAngularDateTimePickerDataModel, TemplateTypeEnum } from 'projects/mds-angular-persian-date-time-picker/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MdsAngularPersianDateTimePicker Sample';

  rangeSelector = false;
  timePicker = false;
  inLine = false;
  isPersian = false;
  persianChar = false;
  format = '';
  templateType = TemplateTypeEnum.bootstrap.toString();
  placeHolder = 'Date Time Picker';

  dateTime: IMdsAngularDateTimePickerDataModel = {
    selectedDate: new Date(Date.parse('2016-01-01 3:3:3')),
    selectedRangeDates: []
  };


}
