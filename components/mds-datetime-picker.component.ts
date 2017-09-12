import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MdsDatetimePickerUtility } from '../assests/mds-datetime-picker.utility';
import { MdsDatetimePickerCoreComponent } from './core/mds-datetime-picker-core.component';
import { TextBoxTypeEnum, TemplateTypeEnum } from "../assests/enums";
import { IDate, IRangeDate } from "../assests/interfaces";


@Component({
  selector: 'mds-datetime-picker',
  templateUrl: './mds-datetime-picker.component.html',
  styleUrls: ['./mds-datetime-picker.component.css']
})
export class MdsDatetimePickerComponent implements OnInit, AfterViewInit {

  constructor(private element: ElementRef) {
    const doc = document.getElementsByTagName('html')[0];
    doc.addEventListener('click', (event) => {
      var targetElement = event.target as HTMLElement;
      if (this.showDatePicker && event.target &&
        this.element.nativeElement !== event.target &&
        !this.element.nativeElement.contains(event.target) &&
        !targetElement.hasAttribute('data-mdspersiancalendar')) {
        this.showDatePicker = false;
        this.mdsDateTimePickerCore.hideSelecMonthAndYearBlock();
        this.mdsDateTimePickerCore.resetIncompleteRanges();
      }
    }, false);
  }

  ngOnInit() {
    this.initialValue = !this.persianChar ? MdsDatetimePickerUtility.toEnglishString(this.initialValue) : MdsDatetimePickerUtility.toPersianNumber(this.initialValue);
    if (this.initialValue != '' && this.rangeSelector) {
      if (this.isPersian)
        MdsDatetimePickerUtility.getPersianDateRanges(this.initialValue);
      else
        MdsDatetimePickerUtility.getDateRanges(this.initialValue);
      this.textboxValue = this.initialValue;
    }
    else
      this.textboxValue = this.initialValue;
    if (!this.isPersian) this.persianChar = false;
  }
  ngAfterViewInit() {
    this.afterViewInit = true;
  }

  @ViewChild('mdsDateTimePickerCore') private mdsDateTimePickerCore: MdsDatetimePickerCoreComponent;

  @Input() templateType: TemplateTypeEnum = TemplateTypeEnum.bootstrap;
  @Input() textBoxType: TextBoxTypeEnum = TextBoxTypeEnum.withButton;
  @Input() initialValue = '';
  @Input() inLine = true;
  @Input() persianChar = true;
  @Input() rangeSelector = false;
  @Input() isPersian = true;
  @Input() timePicker = true;
  @Input() placeHolder = '';
  @Input() buttonIcon = '📅';
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
  @Input() format = '';

  @Output() dateChanged = new EventEmitter<IDate>();
  @Output() rangeDateChanged = new EventEmitter<IRangeDate>();
  @Output() keyDown = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();

  textboxValue = '';

  private _selectedDateTime: Date = null;
  get selectedDateTime(): Date {
    return this._selectedDateTime;
  }
  set selectedDateTime(value: Date) {
    try {
      this.mdsDateTimePickerCore.setDateTimeByDate(value == null ? null : new Date(value));
      if (value == null)
        this._selectedDateTime = null;
      else
        this._selectedDateTime = new Date(value);
    } catch (e) {
      this.clear();
      console.error(e);
    }
  }

  private _selectedDateTimeRanges: Date[] = null;
  get selectedDateTimeRanges(): Date[] {
    return this._selectedDateTimeRanges;
  }
  set selectedDateTimeRanges(values: Date[]) {
    try {
      if (values == null || values.length < 2) return;
      this.mdsDateTimePickerCore.setDateTimeRangesByDate(
        values[0] == null ? null : new Date(values[0]),
        values[1] == null ? null : new Date(values[1]));
      this._selectedDateTimeRanges = [values[0], values[1]];
    } catch (e) {
      this.clear();
      console.error(e);
    }
  }

  private topOffset = 0;
  private leftOffset = 0;
  private showDatePicker = false;
  private afterViewInit = false;
  private alreadyShowDatePickerClicked = false;
  private inClearFunction = false;

  private showDatePickerButtonClicked() {
    this.showDatePicker = !this.showDatePicker;
    this.alreadyShowDatePickerClicked = true;
    if (this.showDatePicker) {
      const rectObject = this.element.nativeElement.getBoundingClientRect();
      this.topOffset = rectObject.top;
      this.leftOffset = rectObject.left;
    }
  }
  private dateChangedHandler(date: IDate) {
    if (!this.afterViewInit) return;
    this.dateChanged.emit(date);
    if (date != null) {
      this.textboxValue = date.formatString;
      this.selectedDateTime = new Date(date.utcDateTime);
      this.showDatePicker = false;
    }
  }
  private rangeDateChangedHandler(rangeDate: IRangeDate) {
    if (!this.afterViewInit) return;
    this.textboxValue = '';
    if (rangeDate == null) {
      this.rangeDateChanged.emit(rangeDate);
      this.selectedDateTimeRanges = [null, null];
      return;
    }
    if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '')
      this.textboxValue = `${rangeDate.startDate.formatString} - ${rangeDate.endDate.formatString}`;
    this.rangeDateChanged.emit(rangeDate);
    if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '')
      this.showDatePicker = false;
    this.selectedDateTimeRanges = [rangeDate.startDate.utcDateTime, rangeDate.endDate.utcDateTime];
  }
  private dateTimeTextBoxOnFocusHandler(event) {
    if (this.alreadyShowDatePickerClicked) {
      this.alreadyShowDatePickerClicked = false;
      return;
    }
    this.alreadyShowDatePickerClicked = false;
    document.getElementsByTagName('html')[0].click();
    try {
      if (this.selectedDateTime != null)
        this.mdsDateTimePickerCore.setDateTimeByDate(this.selectedDateTime);
    } catch (e) {
      this.clear();
      console.error(e);
    }
    this.showDatePickerButtonClicked();
    this.focus.emit(event);
  }
  private dateTimeTextBoxOnBlurHandler(event: any): void {
    if (this.alreadyShowDatePickerClicked && this.textBoxType == TextBoxTypeEnum.withButton) {
      this.alreadyShowDatePickerClicked = false;
      return;
    }
    this.alreadyShowDatePickerClicked = false;
    this.textboxValue = this.textboxValue.trim();
    if (this.persianChar)
      this.textboxValue = MdsDatetimePickerUtility.toPersianNumber(this.textboxValue);
    else
      this.textboxValue = MdsDatetimePickerUtility.toEnglishString(this.textboxValue);
    this.blur.emit(event);
  }
  private dateTimeTextBoxOnKeyDownHandler(event: any): void {
    this.keyDown.emit(event);
    if (event.keyCode != 13) return;
    let value = event.target.value.trim();
    if (value == '')
      this.mdsDateTimePickerCore.clearDateTimePicker();
    else
      this.mdsDateTimePickerCore.setDateTimeByString(this.textboxValue);
    this.showDatePicker = false;
  }

  clear() {
    if (this.inClearFunction) return;
    this.inClearFunction = true;
    this.textboxValue = '';
    this.selectedDateTime = null;
    this.selectedDateTimeRanges = [null, null];
    this.mdsDateTimePickerCore.clearDateTimePicker();
    this.inClearFunction = false;
  }
  setDateTime(dateTime: Date) {
    try {
      this.mdsDateTimePickerCore.setDateTimeByDate(dateTime);
    } catch (e) {
      this.clear();
      console.error(e);
    }
  }
  setDateTimeRanges(startDateTime: Date, endDateTime: Date) {
    try {
      this.mdsDateTimePickerCore.setDateTimeRangesByDate(startDateTime, endDateTime);
    } catch (e) {
      this.clear();
      console.error(e);
    }
  }
}