export interface IMdsAngularDateTimePickerDay {
  year: number;
  month: number;
  day: number;
  dayString: string;
  disable: boolean;
  holiDay: boolean; // تعطیل
  today: boolean; // آیا تاریخ برابر با امروز است
  isWithinRange: boolean; // آیا در محدوده رنج انتخاب شده می باشد
  isStartOrEndOfRange: boolean; // آیا برابر با تاریخ شروع یا پایان می باشد
}

export interface IMdsAngularDateTimePickerDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  formatString: string;
  utcDateTime: Date;
}

export interface IMdsAngularDateTimePickerRangeDate {
  startDate: IMdsAngularDateTimePickerDate;
  endDate: IMdsAngularDateTimePickerDate;
}

export interface IMdsAngularDateTimePickerEventModel {
  eventArgs: any;
  selectedDate: IMdsAngularDateTimePickerDate;
  selectedRangeDates: IMdsAngularDateTimePickerRangeDate;
}

export interface IMdsAngularDateTimePickerDateModel {
  selectedDate: IMdsAngularDateTimePickerDate;
  selectedRangeDates: IMdsAngularDateTimePickerRangeDate;
}

export interface IMdsAngularDateTimePickerDataModel {
  selectedDate: Date;
  selectedRangeDates: Date[];
}
