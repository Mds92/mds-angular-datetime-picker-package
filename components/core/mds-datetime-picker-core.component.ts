import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MdsDatetimePickerResourcesService } from '../../services/mds-datetime-picker-resources.service';
import { MdsDatetimePickerUtility } from '../../assests/mds-datetime-picker.utility'
import { Mds } from 'mds.persian.datetime';
import PersianDateTime = Mds.PersianDateTime;
import PersianDayOfWeek = Mds.PersianDayOfWeek;
import GregorianDayOfWeek = Mds.GregorianDayOfWeek;
import { TemplateTypeEnum } from "../../assests/Enums";
import { IDate, IRangeDate, IDay } from "../../assests/interfaces";

@Component({
  selector: 'mds-datetime-picker-core',
  templateUrl: './mds-datetime-picker-core.component.html',
  styleUrls: ['./mds-datetime-picker-core.component.css'],
  animations: [
    trigger('daysStateName',
      [
        transition('void => *', [
          style({ transform: 'rotateY(90deg)' }),
          animate('200ms ease-in')
        ])
      ]),
    trigger('monthAndYearSelectorVisibility',
      [
        state('visible', style({ opacity: 1, transform: 'rotateY(0deg)' })),
        state('hidden', style({ opacity: 0, transform: 'rotateY(90deg)' })),
        transition('hidden => visible', [animate('0.2s ease-in')]),
        transition('visible => hidden', [animate('0.2s ease-out')])
      ])
  ]
})
export class MdsDatetimePickerCoreComponent implements OnInit {

  constructor(private resourcesService: MdsDatetimePickerResourcesService) { }
  ngOnInit() {
    if (this.rangeSelector) this.timePicker = false;
    if (!this.isPersian) this.persianChar = false;
    if (this.format == '') {
      this.format = 'yyyy/MM/dd';
      if (this.timePicker && !this.rangeSelector)
        this.format += '   hh:mm:ss';
    }
    if (this.initialValue != '') {
      if (this.rangeSelector) {
        try {
          if (this.isPersian)
            [this.startMdsPersianDateTime, this.endMdsPersianDateTime] = MdsDatetimePickerUtility.getPersianDateRanges(this.initialValue);
          else
            [this.startDateTime, this.endDateTime] = MdsDatetimePickerUtility.getDateRanges(this.initialValue);
          this.mdsPersianDateTime = this.startMdsPersianDateTime;
          this.dateTime = this.startDateTime;
        } catch (e) {
          console.error('initialValue is in wrong format, when rangeSelector is true you should write initialValue like "1396/03/01 - 1396/03/15"', e);
          this.startMdsPersianDateTime = null;
          this.endMdsPersianDateTime = null;
          this.startDateTime = null;
          this.endDateTime = null;
          this.mdsPersianDateTime = PersianDateTime.now;
          this.dateTime = new Date();
          this.initialValue = '';
        }
      }
      else {
        try {
          this.mdsPersianDateTime = PersianDateTime.parse(this.initialValue);
          this.dateTime = new Date(Date.parse(this.initialValue));
        } catch (e) {
          console.error('initialValue is in wrong format, you should write initialValue like "1396/03/01  11:30:27", you can remove time', e);
          this.startMdsPersianDateTime = null;
          this.endMdsPersianDateTime = null;
          this.startDateTime = null;
          this.endDateTime = null;
          this.mdsPersianDateTime = PersianDateTime.now;
          this.dateTime = new Date();
          this.initialValue = '';
        }
      }
    } else {
      this.mdsPersianDateTime = PersianDateTime.now;
      this.dateTime = new Date();
    }
    this.updateYearsListForToSelect();
    this.updateMonthDays();
    this.resources = this.isPersian ? this.resourcesService.persianResources : this.resourcesService.englishResources;
    if (this.initialValue != '') {
      if (this.rangeSelector)
        this.fireRangeChangeEvent();
      else
        this.fireChangeEvent();
    }
  }

  @Input() templateType: TemplateTypeEnum = TemplateTypeEnum.bootstrap;
  @Input() initialValue = '';
  @Input() persianChar = true;
  @Input() isPersian = true;
  @Input() rangeSelector = false;
  @Input() timePicker = false;
  /**
    * فرمت پیش فرض 1393/09/14   13:49:40 
    * yyyy: سال چهار رقمی 
    * yy: سال دو رقمی 
    * MMMM: نام فارسی ماه 
    * MM: عدد دو رقمی ماه 
    * M: عدد یک رقمی ماه 
    * dddd: نام فارسی روز هفته 
    * dd: عدد دو رقمی روز ماه 
    * d: عدد یک رقمی روز ماه 
    * HH: ساعت دو رقمی با فرمت 00 تا 24 
    * H: ساعت یک رقمی با فرمت 0 تا 24 
    * hh: ساعت دو رقمی با فرمت 00 تا 12 
    * h: ساعت یک رقمی با فرمت 0 تا 12 
    * mm: عدد دو رقمی دقیقه 
    * m: عدد یک رقمی دقیقه 
    * ss: ثانیه دو رقمی 
    * s: ثانیه یک رقمی 
    * fff: میلی ثانیه 3 رقمی 
    * ff: میلی ثانیه 2 رقمی 
    * f: میلی ثانیه یک رقمی 
    * tt: ب.ظ یا ق.ظ 
    * t: حرف اول از ب.ظ یا ق.ظ 
    **/
  @Input() format = ''; // فرمت نوشتن تاریخ در تارگت

  @Output() dateChanged = new EventEmitter<IDate>();
  @Output() rangeDateChanged = new EventEmitter<IRangeDate>();

  daysAnimationStateName = 'visible';
  monthOrYearSelectorVisibilityStateName = 'hidden';
  monthSelectorVisibilityStateName = 'hidden';
  yearSelectorVisibilityStateName = 'hidden';

  private showMonthSelectorBlock: boolean;
  private showYearsSelectorBlock: boolean;

  mdsPersianDateTime: PersianDateTime; // تاریخ فارسی
  startMdsPersianDateTime: PersianDateTime = null; // تاریخ شروع فارسی
  endMdsPersianDateTime: PersianDateTime = null; // تاریخ پایان فارسی
  private startMdsPersianDateTimeToDateTemp: Date = null;
  private endMdsPersianDateTimeToDateTemp: Date = null;

  dateTime: Date; // تاریخ میلادی
  startDateTime: Date = null; // تاریخ شروع میلادی
  endDateTime: Date = null; // تاریخ پایان میلادی

  yearsToSelect: string[];
  daysInMonth: IDay[];
  weekDayNames: string[];
  resources: any;

  get selectedYear(): number {
    if (this.isPersian) return this.mdsPersianDateTime.year;
    return this.dateTime.getFullYear();
  }
  get selectedYearString(): string {
    if (this.isPersian) return MdsDatetimePickerUtility.toPersianNumber(this.selectedYear.toString());
    return this.dateTime.getFullYear().toString();
  }
  get selectedMonth(): number {
    if (this.isPersian) return PersianDateTime.getPersianMonthIndex(this.selectedMonthName);
    return this.dateTime.getMonth();
  }
  get selectedMonthName(): string {
    if (this.isPersian) return this.mdsPersianDateTime.monthName;
    return PersianDateTime.getGregorianMonthNames[this.selectedMonth];
  }
  get selectedDay(): number {
    if (this.rangeSelector) return 0;
    if (this.isPersian) return this.mdsPersianDateTime.day;
    return this.dateTime.getDate();
  }
  get monthNames(): string[] {
    if (this.isPersian) {
      const allPersianMonths = PersianDateTime.getPersianMonthNames;
      return [
        allPersianMonths[2], allPersianMonths[1], allPersianMonths[0],
        allPersianMonths[5], allPersianMonths[4], allPersianMonths[3],
        allPersianMonths[8], allPersianMonths[7], allPersianMonths[6],
        allPersianMonths[11], allPersianMonths[10], allPersianMonths[9]
      ];
    } else {
      return PersianDateTime.getGregorianMonthNames;
    }
  }
  get weekdayNames(): string[] {
    if (this.isPersian) {
      // حروف اول نام های روز هفته شمسی
      const persianWeekDayNames = PersianDateTime.getPersianWeekdayNames;
      return [
        persianWeekDayNames[6][0], persianWeekDayNames[5][0], persianWeekDayNames[4][0], persianWeekDayNames[3][0], persianWeekDayNames[2][0], persianWeekDayNames[1][0],
        persianWeekDayNames[0][0]
      ];
    } else {
      const gregorianWeekDayNames = PersianDateTime.getGregorianWeekdayNames;
      return [
        gregorianWeekDayNames[0][0] + gregorianWeekDayNames[0][1],
        gregorianWeekDayNames[1][0] + gregorianWeekDayNames[1][1],
        gregorianWeekDayNames[2][0] + gregorianWeekDayNames[2][1],
        gregorianWeekDayNames[3][0] + gregorianWeekDayNames[3][1],
        gregorianWeekDayNames[4][0] + gregorianWeekDayNames[4][1],
        gregorianWeekDayNames[5][0] + gregorianWeekDayNames[5][1],
        gregorianWeekDayNames[6][0] + gregorianWeekDayNames[6][1]
      ];
    }
  }
  get hour(): string {
    if (this.isPersian) {
      if (this.persianChar)
        return MdsDatetimePickerUtility.toPersianNumber(this.mdsPersianDateTime.hour.toString());
      return this.mdsPersianDateTime.hour.toString();
    }
    return this.dateTime.getHours().toString();
  }
  get minute(): string {
    if (this.isPersian) {
      if (this.persianChar)
        return MdsDatetimePickerUtility.toPersianNumber(this.mdsPersianDateTime.minute.toString());
      return this.mdsPersianDateTime.minute.toString();
    }
    return this.dateTime.getMinutes().toString();
  }
  get second(): string {
    if (this.isPersian) {
      if (this.persianChar)
        return MdsDatetimePickerUtility.toPersianNumber(this.mdsPersianDateTime.second.toString());
      return this.mdsPersianDateTime.second.toString();
    }
    return this.dateTime.getSeconds().toString();
  }
  get isRejectButtonDisable(): boolean {
    if (this.isPersian)
      return this.startMdsPersianDateTime == null && this.endMdsPersianDateTime == null;
    else
      return this.startDateTime == null && this.endDateTime == null;
  }
  get isConfirmButtonDisable(): boolean {
    if (this.isPersian)
      return this.startMdsPersianDateTime == null || this.endMdsPersianDateTime == null;
    else
      return this.startDateTime == null || this.endDateTime == null;
  }
  private get persianStartDayOfMonth(): PersianDayOfWeek {
    return this.mdsPersianDateTime.startDayOfMonthDayOfWeek;
  }
  private get gregorianStartDayOfMonth(): GregorianDayOfWeek {
    return new Date(this.dateTime.getFullYear(), this.dateTime.getMonth(), 1).getDay() as GregorianDayOfWeek;
  }

  private updateYearsListForToSelect(): void {
    this.yearsToSelect = new Array();
    const selectedYear = this.isPersian ? this.mdsPersianDateTime.year : this.dateTime.getFullYear();
    for (let i = selectedYear - 37; i <= selectedYear + 37; i++) {
      if (this.isPersian)
        this.yearsToSelect.push(MdsDatetimePickerUtility.toPersianNumber(i.toString()));
      else
        this.yearsToSelect.push(i.toString());
    }
  }
  private getDayObject(year: number, month: number, day: number, disabled: boolean, holiday: boolean, isToday: boolean): IDay {
    let isWithinDateRange = false;
    let isStartOrEndOfRange = false;
    if (this.rangeSelector &&
      (this.isPersian && this.startMdsPersianDateTime != null) ||
      (!this.isPersian && this.startDateTime != null)) {
      if (this.isPersian) {
        const persianDateTime = PersianDateTime.fromPersianDate(year, month, day).toDate();
        isWithinDateRange = persianDateTime >= this.startMdsPersianDateTimeToDateTemp;
        if (this.endMdsPersianDateTime != null)
          isWithinDateRange = isWithinDateRange && persianDateTime <= this.endMdsPersianDateTimeToDateTemp;
        isStartOrEndOfRange =
          (this.startMdsPersianDateTimeToDateTemp != null && persianDateTime.getTime() == this.startMdsPersianDateTimeToDateTemp.getTime()) ||
          (this.endMdsPersianDateTimeToDateTemp != null && persianDateTime.getTime() == this.endMdsPersianDateTimeToDateTemp.getTime());
      } else {
        const dateTime = new Date(year, month, day);
        isWithinDateRange = dateTime >= this.startDateTime;
        if (this.endDateTime != null)
          isWithinDateRange = isWithinDateRange && dateTime <= this.endDateTime;
        isStartOrEndOfRange =
          (this.startDateTime != null && dateTime.getTime() == this.startDateTime.getTime()) ||
          (this.endDateTime != null && dateTime.getTime() == this.endDateTime.getTime());
      }
    }
    return {
      year: year,
      month: month,
      day: day,
      dayString: this.persianChar ? MdsDatetimePickerUtility.toPersianNumber(day.toString()) : day.toString(),
      disable: disabled,
      holiday: holiday,
      today: isToday,
      isWithinRange: isWithinDateRange,
      isStartOrEndOfRange: isStartOrEndOfRange
    }
  }
  private isRangeSelectorReady(): boolean {
    if (!this.rangeSelector) return false;
    if ((this.isPersian && this.startMdsPersianDateTime == null) || (!this.isPersian && this.startDateTime == null)) return false; // هنوز روز شروع انتخاب نشده است
    if (this.isPersian && this.startMdsPersianDateTime != null && this.endMdsPersianDateTime != null) return false; // رنج تاریخ انتخاب شده بود
    if (!this.isPersian && this.startDateTime != null && this.endDateTime != null) return false; // رنج تاریخ انتخاب شده بود
    return true;
  }
  private getDate(): IDate {
    let iDate: IDate;
    if (this.isPersian)
      iDate = {
        year: this.mdsPersianDateTime.year,
        month: this.mdsPersianDateTime.month,
        day: this.mdsPersianDateTime.day,
        hour: this.mdsPersianDateTime.hour,
        minute: this.mdsPersianDateTime.minute,
        second: this.mdsPersianDateTime.second,
        millisecond: this.mdsPersianDateTime.millisecond,
        formatString: this.mdsPersianDateTime.toString(this.format),
        utcDateTime: this.mdsPersianDateTime.toDate()
      };
    else {
      iDate = {
        year: this.dateTime.getFullYear(),
        month: this.dateTime.getMonth(),
        day: this.dateTime.getDate(),
        hour: this.dateTime.getHours(),
        minute: this.dateTime.getMinutes(),
        second: this.dateTime.getSeconds(),
        millisecond: this.dateTime.getMilliseconds(),
        formatString: MdsDatetimePickerUtility.dateTimeToString(this.dateTime),
        utcDateTime: this.mdsPersianDateTime.toDate()
      };
    }
    if (this.persianChar)
      iDate.formatString = MdsDatetimePickerUtility.toPersianNumber(iDate.formatString);
    else
      iDate.formatString = MdsDatetimePickerUtility.toEnglishString(iDate.formatString);
    return iDate;
  }
  private updateMonthDays(): void {
    const days = new Array();
    let counter = 0,
      year = 0,
      month = 0;
    this.startMdsPersianDateTimeToDateTemp = this.startMdsPersianDateTime != null ? this.startMdsPersianDateTime.toDate() : null;
    this.endMdsPersianDateTimeToDateTemp = this.endMdsPersianDateTime != null ? this.endMdsPersianDateTime.toDate() : null;
    if (this.isPersian) {
      const persianDateTimeNow = PersianDateTime.now;
      const today = persianDateTimeNow.day;
      const isYearAndMonthInCurrentMonth = persianDateTimeNow.year == this.mdsPersianDateTime.year && persianDateTimeNow.month == this.mdsPersianDateTime.month;
      // روزهای ماه قبل
      if (this.persianStartDayOfMonth != PersianDayOfWeek.Saturday) {
        const previousPersianMonth = this.mdsPersianDateTime.addMonths(-1);
        year = previousPersianMonth.year;
        month = previousPersianMonth.month;
        for (let i = previousPersianMonth.getMonthDays - this.persianStartDayOfMonth + 1;
          i <= previousPersianMonth.getMonthDays;
          i++) {
          counter++;
          days.push(this.getDayObject(year, month, i, true, false, false));
        }
      }
      // روزهای ماه جاری
      year = this.mdsPersianDateTime.year;
      month = this.mdsPersianDateTime.month;
      for (let i = 1; i <= this.mdsPersianDateTime.getMonthDays; i++) {
        counter++;
        days.push(this.getDayObject(year, month, i, false, false, isYearAndMonthInCurrentMonth && i == today));
      }
      // روزهای ماه بعد
      const nextMonthPersianDateTime = this.mdsPersianDateTime.addMonths(1);
      year = nextMonthPersianDateTime.year;
      month = nextMonthPersianDateTime.month;
      for (let i = 1; counter <= (6 * 7) - 1; i++) {
        counter++;
        days.push(this.getDayObject(year, month, i, true, false, false));
      }
      // درست کردن راست به چپ بودن تقویم
      const temp = days.slice(0);
      for (let row = 0; row < 6; row++) {
        for (let column = 0; column < 7; column++) {

          const index1 = row * 7 + column;
          const index2 = Math.abs((row + 1) * 7 - (column + 1));
          days[index1] = temp[index2];

          if (column == 0)
            days[index1].holiday = true;
        }
      }
    }
    else {
      const dateTimeNow = new Date();
      const today = dateTimeNow.getDate();
      const isYearAndMonthInCurrentMonth = dateTimeNow.getMonth() == this.dateTime.getMonth() &&
        dateTimeNow.getFullYear() == this.dateTime.getFullYear();
      // روزهای ماه قبل
      if (this.gregorianStartDayOfMonth != GregorianDayOfWeek.Saturday) {
        const dateTimeClone = new Date(this.dateTime.getTime());
        dateTimeClone.setMonth(this.dateTime.getMonth() - 1);
        year = dateTimeClone.getFullYear();
        month = dateTimeClone.getMonth();
        const previousMonthDays = new Date(dateTimeClone.getFullYear(), dateTimeClone.getMonth(), 0).getDate();
        for (let i = previousMonthDays - this.gregorianStartDayOfMonth + 1; i <= previousMonthDays; i++) {
          counter++;
          days.push(this.getDayObject(year, month, i, true, false, false));
        }
      }
      // روزهای ماه جاری
      year = this.dateTime.getFullYear();
      month = this.dateTime.getMonth();
      const currentMonthDays = new Date(year, month, 0).getDate();
      for (let i = 1; i <= currentMonthDays; i++) {
        counter++;
        days.push(this.getDayObject(year, month, i, false, false, isYearAndMonthInCurrentMonth && i == today));
      }
      // روزهای ماه بعد
      const nectMonthDateTime = new Date(year, month + 1, 1);
      year = nectMonthDateTime.getFullYear();
      month = nectMonthDateTime.getMonth();
      for (let i = 1; counter <= (6 * 7) - 1; i++) {
        counter++;
        days.push(this.getDayObject(year, month, i, true, false, false));
      }
      // تعطیل کردن روزهای جمعه
      for (let row = 0; row < 6; row++) {
        for (let column = 0; column < 7; column++) {
          const index1 = row * 7 + column;
          if (column == 0)
            days[index1].holiday = true;
        }
      }
    }
    this.daysInMonth = days;
  }
  private fireChangeEvent(): void {
    this.dateChanged.emit(this.getDate());
  }
  private fireRangeChangeEvent(): void {
    let startDate: IDate;
    let endDate: IDate;
    if (this.isPersian) {
      startDate = {
        year: this.startMdsPersianDateTime == null ? 0 : this.startMdsPersianDateTime.year,
        month: this.startMdsPersianDateTime == null ? 0 : this.startMdsPersianDateTime.month,
        day: this.startMdsPersianDateTime == null ? 0 : this.startMdsPersianDateTime.day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        formatString: this.startMdsPersianDateTime == null ? '' : this.startMdsPersianDateTime.toString(this.format),
        utcDateTime: this.startMdsPersianDateTime == null ? null : this.startMdsPersianDateTime.toDate(),
      };
      endDate = {
        year: this.endMdsPersianDateTime == null ? 0 : this.endMdsPersianDateTime.year,
        month: this.endMdsPersianDateTime == null ? 0 : this.endMdsPersianDateTime.month,
        day: this.endMdsPersianDateTime == null ? 0 : this.endMdsPersianDateTime.day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        formatString: this.endMdsPersianDateTime == null ? '' : this.endMdsPersianDateTime.toString(this.format),
        utcDateTime: this.endMdsPersianDateTime == null ? null : this.endMdsPersianDateTime.toDate(),
      }
    } else {
      startDate = {
        year: this.startDateTime == null ? 0 : this.startDateTime.getFullYear(),
        month: this.startDateTime == null ? 0 : this.startDateTime.getMonth(),
        day: this.startDateTime == null ? 0 : this.startDateTime.getDate(),
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        formatString: this.startDateTime == null ? '' : MdsDatetimePickerUtility.dateTimeToString(this.startDateTime, this.format),
        utcDateTime: this.startDateTime == null ? null : this.startDateTime,
      };
      endDate = {
        year: this.endDateTime == null ? 0 : this.endDateTime.getFullYear(),
        month: this.endDateTime == null ? 0 : this.endDateTime.getMonth(),
        day: this.endDateTime == null ? 0 : this.endDateTime.getDate(),
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        formatString: this.endDateTime == null ? '' : MdsDatetimePickerUtility.dateTimeToString(this.endDateTime, this.format),
        utcDateTime: this.endDateTime == null ? null : this.endDateTime,
      }
    }
    this.rangeDateChanged.emit({
      startDate: startDate,
      endDate: endDate
    });
  }
  private getStartEndDate(dateString: string): string[] {
    return dateString.split(' - ');
  }
  private resetToFalseRangeParametersInMonthDays(): void {
    for (let iday of this.daysInMonth) {
      iday.isWithinRange = false;
      iday.isStartOrEndOfRange = false;
    }
  }

  /**
   * مخفی کردن بلاک های انتخاب ماه و سال
   */
  hideSelecMonthAndYearBlock(): void {
    this.monthOrYearSelectorVisibilityStateName = 'hidden';
    this.monthSelectorVisibilityStateName = 'hidden';
    this.yearSelectorVisibilityStateName = 'hidden';
  }
  resetIncompleteRanges(): void {
    if (!this.isPersian && (this.startDateTime == null || this.endDateTime == null)) {
      this.startDateTime = null;
      this.endDateTime = null;
      this.startMdsPersianDateTime = null;
      this.endMdsPersianDateTime = null;
      this.resetToFalseRangeParametersInMonthDays();
    }
    else if (this.isPersian && (this.startMdsPersianDateTime == null || this.endMdsPersianDateTime == null)) {
      this.startDateTime = null;
      this.endDateTime = null;
      this.startMdsPersianDateTime = null;
      this.endMdsPersianDateTime = null;
      this.resetToFalseRangeParametersInMonthDays();
    }
  }

  setDateTime(date: IDate): void {
    if (this.isPersian) {
      this.mdsPersianDateTime = PersianDateTime.fromPersianDateTime(date.year,
        date.month,
        date.day,
        date.hour,
        date.minute,
        date.second,
        date.millisecond);
      this.dateTime = this.mdsPersianDateTime.toDate();
    } else {
      this.dateTime = new Date(date.year,
        date.month,
        date.day,
        date.hour,
        date.minute,
        date.second,
        date.millisecond);
      this.mdsPersianDateTime = new PersianDateTime(this.dateTime);
    }
    this.updateMonthDays();
  }
  setDateTimeByString(dateTimeString: string) {
    try {
      if(dateTimeString == '') return;
      if (this.isPersian) {
        if (this.rangeSelector) {
          const startAndEndDateArray = this.getStartEndDate(dateTimeString);
          this.startMdsPersianDateTime = PersianDateTime.parse(startAndEndDateArray[0]);
          this.endMdsPersianDateTime = PersianDateTime.parse(startAndEndDateArray[1]);
          if (this.startMdsPersianDateTime.toDate() > this.endMdsPersianDateTime.toDate())
            throw new Error('start date must be less than end date');
        } else {
          this.mdsPersianDateTime = PersianDateTime.parse(dateTimeString);
          this.dateTime = this.mdsPersianDateTime.toDate();
        }
      } else {
        if (this.rangeSelector) {
          const startAndEndDateArray = this.getStartEndDate(dateTimeString);
          this.startDateTime = new Date(Date.parse(startAndEndDateArray[0]));
          this.endDateTime = new Date(Date.parse(startAndEndDateArray[1]));
          if (this.startDateTime > this.endDateTime)
            throw new Error('start date must be less than end date');
        } else {
          this.dateTime = new Date(Date.parse(dateTimeString));
          this.mdsPersianDateTime = new PersianDateTime(this.dateTime);
        }
      }
      this.updateMonthDays();
    } catch (e) {
      throw new Error(e);
    }
  }
  /**
   * کلیک روی دکمه نام ماه در بالای پیکر برای انتخاب ماه
   */
  selectMonthButtonOnClick(): void {
    this.monthOrYearSelectorVisibilityStateName = 'visible';
    this.monthSelectorVisibilityStateName = 'visible';
  }
  /**
   * کلیک روی دکمه سال در بالای پیکر برای انتخاب سال
   */
  selectYearButtonOnClick(): void {
    this.monthOrYearSelectorVisibilityStateName = 'visible';
    this.yearSelectorVisibilityStateName = 'visible';
  }
  monthsBlockVisibilityAnimationDone(e): void {
    //e.toState
    this.updateMonthDays();
  }
  yearsBlockVisibilityAnimationDone(e): void {
    //e.toState
    this.updateYearsListForToSelect();
    this.updateMonthDays();
  }
  nextYearButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addYears(1);
    else this.dateTime.setFullYear(this.dateTime.getFullYear() + 1);
    this.updateMonthDays();
  }
  nextMonthButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addMonths(1);
    else this.dateTime.setMonth(this.dateTime.getMonth() + 1);
    this.updateMonthDays();
  }
  previousMonthButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addMonths(-1);
    else this.dateTime.setMonth(this.dateTime.getMonth() - 1);
    this.updateMonthDays();
  }
  previousYearButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addYears(-1);
    else this.dateTime.setFullYear(this.dateTime.getFullYear() - 1);
    this.updateMonthDays();
  }
  hourUpButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addHours(1);
    else this.dateTime.setHours(this.dateTime.getHours() + 1);
  }
  hourDownButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addHours(-1);
    else this.dateTime.setHours(this.dateTime.getHours() - 1);
  }
  minuteUpButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addMinutes(1);
    else this.dateTime.setMinutes(this.dateTime.getMinutes() + 1);
  }
  minuteDownButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addMinutes(-1);
    else this.dateTime.setMinutes(this.dateTime.getMinutes() - 1);
  }
  secondUpButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addSeconds(1);
    else this.dateTime.setSeconds(this.dateTime.getSeconds() + 1);
  }
  secondDownButtonOnClick(): void {
    if (this.isPersian) this.mdsPersianDateTime = this.mdsPersianDateTime.addSeconds(-1);
    else this.dateTime.setSeconds(this.dateTime.getSeconds() - 1);
  }
  /**
   * انتخاب ماه از روی لیست ماه ها
   */
  monthOnClick(selectedMonthName): void {
    const monthIndex = this.isPersian ? PersianDateTime.getPersianMonthIndex(selectedMonthName) : PersianDateTime.getGregorianMonthNameIndex(selectedMonthName);
    if (this.isPersian)
      this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianMonth(monthIndex + 1);
    else {
      const dateTimeClone = new Date(this.dateTime.getTime());
      dateTimeClone.setMonth(monthIndex);
      this.dateTime = new Date(dateTimeClone.getTime());
    }
    this.hideSelecMonthAndYearBlock();
  }
  /**
   * انتخاب سال از روی لیست سال ها
   */
  yearOnClick(selectedYear): void {
    const year = this.isPersian ? Number(MdsDatetimePickerUtility.toEnglishNumber(selectedYear)) : Number(selectedYear);
    if (this.isPersian)
      this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianYear(year);
    else {
      const dateTimeClone = new Date(this.dateTime.getTime());
      dateTimeClone.setFullYear(year);
      this.dateTime = new Date(dateTimeClone.getTime());
    }
    this.hideSelecMonthAndYearBlock();
  }
  todayButtonOnClick(): void {
    const persianDateTimeNow = PersianDateTime.now;
    const dateTimeNow = new Date();
    if ((this.isPersian && (this.mdsPersianDateTime.year != persianDateTimeNow.year || this.mdsPersianDateTime.month != persianDateTimeNow.month)) ||
      (!this.isPersian && (this.dateTime.getFullYear() != dateTimeNow.getFullYear() || this.dateTime.getMonth() != dateTimeNow.getMonth()))) {
      this.mdsPersianDateTime = persianDateTimeNow;
      this.dateTime = dateTimeNow;
      this.updateMonthDays();
    } else {
      this.mdsPersianDateTime = persianDateTimeNow;
      this.dateTime = dateTimeNow;
    }
    if (!this.rangeSelector)
      this.fireChangeEvent();
  }
  dayButtonOnClick(dayObject: IDay): void {
    // روی روزهای ماه های قبل یا بعد کلیک شده است
    if (dayObject.disable) {
      if (this.isPersian) {
        this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianDate(dayObject.year, dayObject.month, dayObject.day);
      }
      else {
        const dateTimeClone = new Date(this.dateTime.getTime());
        dateTimeClone.setDate(dayObject.day);
        dateTimeClone.setMonth(dayObject.month);
        dateTimeClone.setFullYear(dayObject.year);
        this.dateTime = new Date(dateTimeClone);
      }
      this.updateMonthDays();
      return;
    }

    // نال کردن تاریخ های شروع و پایان برای انتخاب مجدد رنج تاریخ 
    // در صورتی که رنج گرفته شده بود
    if (this.isPersian && this.startMdsPersianDateTime != null && this.endMdsPersianDateTime != null) {
      this.startMdsPersianDateTime = null;
      this.endMdsPersianDateTime = null;
      this.resetToFalseRangeParametersInMonthDays();
    }
    if (!this.isPersian && this.startDateTime != null && this.endDateTime != null) {
      this.startDateTime = null;
      this.endDateTime = null;
      this.resetToFalseRangeParametersInMonthDays();
    }
    // \\
    if (this.isPersian) {
      this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianDate(dayObject.year, dayObject.month, dayObject.day); // روز انتخاب شده
      if (this.rangeSelector)
        if (this.startMdsPersianDateTime == null ||
          this.startMdsPersianDateTime.toDate() >= this.mdsPersianDateTime.toDate()) {
          this.startMdsPersianDateTime = this.mdsPersianDateTime.date.clone();
          this.resetToFalseRangeParametersInMonthDays();
          dayObject.isStartOrEndOfRange = true;
        } else {
          this.endMdsPersianDateTime = this.mdsPersianDateTime.date.clone();
          dayObject.isStartOrEndOfRange = true;
        }
    }
    else {
      const dateTimeClone = new Date(this.dateTime.getTime());
      dateTimeClone.setDate(dayObject.day);
      dateTimeClone.setMonth(dayObject.month);
      dateTimeClone.setFullYear(dayObject.year);
      this.dateTime = new Date(dateTimeClone.getTime());
      if (this.rangeSelector)
        if (this.startDateTime == null || this.startDateTime >= this.dateTime) {
          this.startDateTime = new Date(dateTimeClone.getFullYear(), dateTimeClone.getMonth(), dateTimeClone.getDate());
          this.resetToFalseRangeParametersInMonthDays();
          dayObject.isStartOrEndOfRange = true;
        } else {
          this.endDateTime = new Date(dateTimeClone.getFullYear(), dateTimeClone.getMonth(), dateTimeClone.getDate());
          dayObject.isStartOrEndOfRange = true;
        }
    }
    if (this.rangeSelector) {
      if ((this.isPersian && this.startMdsPersianDateTime != null && this.endMdsPersianDateTime != null) ||
        (!this.isPersian && this.startDateTime != null && this.endDateTime != null))
        this.fireRangeChangeEvent();
    }
    else
      this.fireChangeEvent();
  }
  dayButtonOnHover(dayObject: IDay): void {
    if (!this.isRangeSelectorReady()) return;
    let hoverCellDate: Date; // تاریخ روزی که موس روی آن است
    let startDate: Date;
    if (this.isPersian) {
      startDate = this.startMdsPersianDateTime.toDate();
      hoverCellDate = PersianDateTime.fromPersianDate(dayObject.year, dayObject.month, dayObject.day).toDate();
    } else {
      startDate = this.startDateTime;
      hoverCellDate = new Date(dayObject.year, dayObject.month, dayObject.day);
    }
    for (let iday of this.daysInMonth) {
      let currentDate: Date;
      if (this.isPersian)
        currentDate = PersianDateTime.fromPersianDate(iday.year, iday.month, iday.day).toDate();
      else
        currentDate = new Date(iday.year, iday.month, iday.day);
      iday.isWithinRange = currentDate >= startDate && currentDate <= hoverCellDate;
    }
  }
  rejectButtonOnClick(): void {
    this.startDateTime = null;
    this.endDateTime = null;
    this.startMdsPersianDateTime = null;
    this.endMdsPersianDateTime = null;
    this.resetToFalseRangeParametersInMonthDays();
    this.fireRangeChangeEvent();
  }
  confirmButtonOnClick(): void {
    if ((this.isPersian && this.startMdsPersianDateTime != null && this.endMdsPersianDateTime != null) ||
      (!this.isPersian && this.startDateTime != null && this.endDateTime != null))
      this.fireRangeChangeEvent();
  }
}