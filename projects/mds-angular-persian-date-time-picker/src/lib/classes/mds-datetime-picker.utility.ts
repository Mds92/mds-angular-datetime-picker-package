import { Mds } from 'mds.persian.datetime';
import PersianDateTime = Mds.PersianDateTime;

export class MdsDatetimePickerUtility {
  static toPersianNumber(input: string): string {
    if (input == '' || input == null) { return ''; }
    input = input.replace(/ي/img, 'ی').replace(/ك/img, 'ک');
    // ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹
    return input.replace(/0/img, '۰')
      .replace(/1/img, '۱')
      .replace(/2/img, '۲')
      .replace(/3/img, '۳')
      .replace(/4/img, '۴')
      .replace(/5/img, '۵')
      .replace(/6/img, '۶')
      .replace(/7/img, '۷')
      .replace(/8/img, '۸')
      .replace(/9/img, '۹');
  }
  static toEnglishNumber(input: string): number {
    if (input == '' || input == null) { return 0; }
    input = input.replace(/ي/img, 'ی').replace(/ك/img, 'ک');
    // ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹
    input = input.replace(/,/img, '')
      .replace(/۰/img, '0')
      .replace(/۱/img, '1')
      .replace(/۲/img, '2')
      .replace(/۳/img, '3')
      .replace(/۴/img, '4')
      .replace(/۵/img, '5')
      .replace(/۶/img, '6')
      .replace(/۷/img, '7')
      .replace(/۸/img, '8')
      .replace(/۹/img, '9');
    return Number(input);
  }
  static toEnglishString(input: string): string {
    if (input == '' || input == null) { return ''; }
    input = input.replace(/ي/img, 'ی').replace(/ك/img, 'ک');
    // ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹
    input = input.replace(/,/img, '')
      .replace(/۰/img, '0')
      .replace(/۱/img, '1')
      .replace(/۲/img, '2')
      .replace(/۳/img, '3')
      .replace(/۴/img, '4')
      .replace(/۵/img, '5')
      .replace(/۶/img, '6')
      .replace(/۷/img, '7')
      .replace(/۸/img, '8')
      .replace(/۹/img, '9');
    return input;
  }
  static dateTimeToString(date: Date, format: string = ''): string {
    if (format == '' || format == null) {
      return `${this.zeroPad(date.getFullYear(), '0000')}/${this.zeroPad(date.getMonth() + 1, '00')}/${this.zeroPad(date.getDate(), '00')}   ${this.zeroPad(date.getHours(), '00')}:${this.zeroPad(date.getMinutes(), '00')}:${this.zeroPad(date.getSeconds(), '00')}`;
    }
    let dateTimeString = format;
    dateTimeString = dateTimeString.replace(/yyyy/g, this.zeroPad(date.getFullYear(), '0000'));
    dateTimeString = dateTimeString.replace(/yy/g, this.zeroPad(date.getFullYear(), '00'));
    dateTimeString = dateTimeString.replace(/dddd/g, this.getGregorianWeekDayName(date.getDay()));
    dateTimeString = dateTimeString.replace(/dd/g, this.zeroPad(date.getDate(), '00'));
    dateTimeString = dateTimeString.replace(/hh/g, this.zeroPad(date.getHours(), '00'));
    dateTimeString = dateTimeString.replace(/mm/g, this.zeroPad(date.getMinutes(), '00'));
    dateTimeString = dateTimeString.replace(/ss/g, this.zeroPad(date.getSeconds(), '00'));
    dateTimeString = dateTimeString.replace(/fff/g, this.zeroPad(date.getMilliseconds(), '000'));
    dateTimeString = dateTimeString.replace(/ff/g, this.zeroPad(date.getMilliseconds() / 10, '00'));
    dateTimeString = dateTimeString.replace(/MMMM/g, this.getGregorianMonthName(date.getMonth()));
    dateTimeString = dateTimeString.replace(/MM/g, this.zeroPad(date.getMonth() + 1, '00'));
    dateTimeString = dateTimeString.replace(/M(?!a)/g, (date.getMonth() + 1).toString());
    // dateTimeString = dateTimeString.replace(/s/g, date.getSeconds().toString());
    // dateTimeString = dateTimeString.replace(/f/g, (date.getMilliseconds() / 10).toString());
    // dateTimeString = dateTimeString.replace(/h/g, date.getHours().toString());
    // dateTimeString = dateTimeString.replace(/m/g, date.getMinutes().toString());
    // dateTimeString = dateTimeString.replace(/d/g, date.getDate().toString());
    return dateTimeString;
  }
  static zeroPad(nr: any, base: string): string {
    if (nr == undefined || nr == '') { return base; }
    const len = (String(base).length - String(nr).length) + 1;
    return len > 0 ? new Array(len).join('0') + nr : nr;
  }
  static getGregorianMonthName(monthIndex: number): string {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][monthIndex];
  }
  static getGregorianWeekDayName(weekDayIndex: number): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'FrIMdsAngularDateTimePickerDay', 'Saturday'][weekDayIndex];
  }
  static getPersianDateRanges(dateRangeString: string): PersianDateTime[] {
    const startEndDateArrayResult = new Array<PersianDateTime>();
    try {
      const startEndDateArray = dateRangeString.split(' - ');
      const startMdsPersianDateTime = PersianDateTime.parse(startEndDateArray[0]);
      const endMdsPersianDateTime = PersianDateTime.parse(startEndDateArray[1]);
      if (endMdsPersianDateTime.toDate() < startMdsPersianDateTime.toDate()) {
        throw new Error('Range date is not valid. End date must be bigger than start date');
      }
      startEndDateArrayResult.push(startMdsPersianDateTime);
      startEndDateArrayResult.push(endMdsPersianDateTime);
    } catch (e) {
      throw new Error('Range date is not valid. You must enter range date string like "1396/03/06 - 1396/03/21"');
    }
    return startEndDateArrayResult;
  }
  static getDateRanges(dateRangeString: string): Date[] {
    const startEndDateArrayResult = new Array<Date>();
    try {
      const startEndDateArray = dateRangeString.split(' - ');
      const startDateTime = new Date(Date.parse(startEndDateArray[0]));
      const endDateTime = new Date(Date.parse(startEndDateArray[1]));
      if (endDateTime < startDateTime) {
        throw new Error('Range date is not valid. End date must be bigger than start date');
      }
      startEndDateArrayResult.push(startDateTime);
      startEndDateArrayResult.push(endDateTime);
    } catch (e) {
      throw new Error('Range date is not valid. You must enter range date string like "2017/02/06 - 2017/02/18"');
    }
    return startEndDateArrayResult;
  }
}
