import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Mds } from 'mds.persian.datetime';
import { TemplateTypeEnum, TextBoxTypeEnum } from './classes/enums';
import { IMdsAngularDateTimePickerDate, IMdsAngularDateTimePickerEventModel, IMdsAngularDateTimePickerRangeDate, IMdsAngularDateTimePickerDateModel } from './classes/interfaces';
import { MdsDatetimePickerUtility } from './classes/mds-datetime-picker.utility';
import { MdsAngularPersianDateTimePickerCoreComponent } from './core/mds-angular-persian-date-time-picker-core.component';
import PersianDateTime = Mds.PersianDateTime;


@Component({
  selector: 'mds-angular-persian-datetimepicker',
  templateUrl: './mds-angular-persian-date-time-picker.component.html',
  styleUrls: ['./mds-angular-persian-date-time-picker.component.css'],
  providers:
    [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MdsAngularPersianDateTimePickerComponent),
        multi: true
      }
    ]
})
export class MdsAngularPersianDateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  constructor(private element: ElementRef) {
    const doc = document.getElementsByTagName('html')[0];
    doc.addEventListener('click', (event) => {
      let targetElement = event.target as HTMLElement;
      if (this.showDatePicker && event.target &&
        this.element.nativeElement !== event.target &&
        !this.element.nativeElement.contains(event.target) &&
        !targetElement.hasAttribute('data-mds-persian-datetimepicker')) {
        this.showDatePicker = false;
        this.mdsDateTimePickerCore.hideSelecMonthAndYearBlock();
        this.mdsDateTimePickerCore.resetIncompleteRanges();
      }
    }, false);
  }

  ngOnInit() {
    // this.initialValue = !this.persianChar ? MdsDatetimePickerUtility.toEnglishString(this.initialValue) : MdsDatetimePickerUtility.toPersianNumber(this.initialValue);
    // if (this.initialValue != '' && this.rangeSelector) {
    //   if (this.isPersian)
    //     MdsDatetimePickerUtility.getPersianDateRanges(this.initialValue);
    //   else
    //     MdsDatetimePickerUtility.getDateRanges(this.initialValue);
    // }
    // this.myControl.setValue(this.initialValue);
    if (!this.isPersian) this.persianChar = false;
  }
  ngAfterViewInit() {
    this.afterViewInit = true;
  }

  @ViewChild('mdsDateTimePickerCore') private mdsDateTimePickerCore: MdsAngularPersianDateTimePickerCoreComponent;

  //#region Input OutPut


  /**
   * از بوت استرپ استفاده شود یا متریال
   * TemplateTypeEnum
   */
  @Input() templateType: TemplateTypeEnum = TemplateTypeEnum.bootstrap;

  /**
   * نوع نمایش تکس باکس
   * TextBoxTypeEnum
   */
  @Input() textBoxType: TextBoxTypeEnum = TextBoxTypeEnum.withButton;
  /**
   * مقدار اولیه
   */
  @Input() initialValue = '';
  /**
   * نوع نمایش دیت پیکر به صورت این لاین باشد یا نه
   */
  @Input() inLine = true;
  /**
   * آیا از کاراکترهای فارسی استفاده شود
   * وقتی تقویم میلادی است بدون تاثیر می شود
   */
  @Input() persianChar = true;
  /**
   * آیا دیت پیکر به شکل انتخاب رنج تاریخی باشد یا نه
   */
  @Input() rangeSelector = false;
  /**
   * تقویم میلادی باشد یا شمسی
   */
  @Input() isPersian = true;
  /**
   * آیا تایم پیکر نمایش داده بشود یا نه
   * در نوع انتخاب رنج تاریخی بدون تاثیر است
   */
  @Input() timePicker = true;
  /**
   * PlaceHolder
   */
  @Input() placeHolder = '';
  /**
   * آیکون
   */
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

  /**
   * وقتی تاریخ انتخابی عوض می شود این اونت فراخوانی می شود
   */
  @Output() dateChanged = new EventEmitter<IMdsAngularDateTimePickerDate>();
  /**
   * وقتی رنج تاریخی انتخاب شده عوض می شود این اونت فراخوانی می شود
   */
  @Output() rangeDateChanged = new EventEmitter<IMdsAngularDateTimePickerRangeDate>();
  /**
   * وقتی کلیدی روی تکس باکس انتخاب تاریخ فشرده می شود این اونت فراخوانی می شود
   */
  @Output() textBoxKeyDown = new EventEmitter<IMdsAngularDateTimePickerEventModel>();
  /**
   * وقتی روی تکس باکس انتخاب تاریخ بلور می شود این اونت فراخوانی می شود
   */
  @Output() textBoxBlur = new EventEmitter<IMdsAngularDateTimePickerEventModel>();
  /**
   * وقتی روی تکس باکس انتخاب تاریخ فوکوس می شود این اونت فراخوانی می شود
   */
  @Output() textBoxFocus = new EventEmitter<IMdsAngularDateTimePickerEventModel>();
  /**
   * وقتی روی تکس باکس انتخاب تاریخ تغییری ایجاد می شود این اونت فراخوانی می شود
   */
  @Output() textBoxChange = new EventEmitter<IMdsAngularDateTimePickerEventModel>();

  //#endregion

  myControl = new FormControl();
  private afterViewInit = false;
  private inClearFunction = false;
  private showingDateTimePickerLocked = false;
  showDatePicker = false;

  private _selectedDateTime: Date = null;
  get selectedDateTime(): Date {
    return this._selectedDateTime;
  }
  set selectedDateTime(value: Date) {
    if (!this.mdsDateTimePickerCore) return;
    try {
      this.mdsDateTimePickerCore.setDateTimeByDate(!value ? null : new Date(value));
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
    if (!this.mdsDateTimePickerCore) return;
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

  private getEventObject(event: any): IMdsAngularDateTimePickerEventModel {
    return {
      eventArgs: event,
      selectedDate: this.mdsDateTimePickerCore.getSelectedDate,
      selectedRangeDates: this.mdsDateTimePickerCore.getSelectedRangeDates
    };
  }
  private getSelectedDateObject(): IMdsAngularDateTimePickerDateModel {
    return {
      selectedDate: this.mdsDateTimePickerCore.getSelectedDate,
      selectedRangeDates: this.mdsDateTimePickerCore.getSelectedRangeDates
    };
  }
  showDatePickerButtonClicked() {
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      //const rectObject = this.element.nativeElement.getBoundingClientRect();
      //this.topOffset = rectObject.top;
      //this.leftOffset = rectObject.left;
    }
  }
  dateChangedHandler(date: IMdsAngularDateTimePickerDate) {
    if (!this.afterViewInit) return;
    this.dateChanged.emit(date);
    if (date != null) {
      this.myControl.setValue(date.formatString);
      this.selectedDateTime = new Date(date.utcDateTime);
      if (!this.showingDateTimePickerLocked)
        this.showDatePicker = false;
      this.propagateChange(this.getSelectedDateObject());
    }
  }
  rangeDateChangedHandler(rangeDate: IMdsAngularDateTimePickerRangeDate) {
    if (!this.afterViewInit) return;
    this.myControl.setValue('');
    if (rangeDate == null) {
      this.rangeDateChanged.emit(rangeDate);
      this.selectedDateTimeRanges = [null, null];
      this.propagateChange(this.getSelectedDateObject());
      return;
    }
    if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '')
      this.myControl.setValue(`${rangeDate.startDate.formatString} - ${rangeDate.endDate.formatString}`);
    this.rangeDateChanged.emit(rangeDate);
    if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '' && !this.showingDateTimePickerLocked)
      this.showDatePicker = false;
    this.selectedDateTimeRanges = [rangeDate.startDate.utcDateTime, rangeDate.endDate.utcDateTime];
    this.propagateChange(this.getSelectedDateObject());
  }
  dateTimeTextBoxOnFocusHandler(event: any) {
    document.getElementsByTagName('html')[0].click();
    try {
      if (this.selectedDateTime != null)
        this.mdsDateTimePickerCore.setDateTimeByDate(this.selectedDateTime);
    } catch (e) {
      this.clear();
      console.error(e);
    }
    this.showDatePickerButtonClicked();
    this.textBoxFocus.emit(this.getEventObject(event));
  }
  dateTimeTextBoxOnBlurHandler(event: any): void {
    let value = !this.myControl.value ? '' : this.myControl.value.trim();
    if (this.persianChar)
      value = MdsDatetimePickerUtility.toPersianNumber(value);
    else
      value = MdsDatetimePickerUtility.toEnglishString(value);
    let targetElement = event.target as HTMLElement;
    if (!targetElement.hasAttribute('data-mds-persian-datetimepicker')) {
      this.showingDateTimePickerLocked = true;
      this.mdsDateTimePickerCore.setDateTimeByString(value);
      this.showingDateTimePickerLocked = false;
    }
    this.textBoxBlur.emit(this.getEventObject(event));
  }
  dateTimeTextBoxOnKeyDownHandler(event: any): void {
    if (event.keyCode != 13) {
      this.textBoxKeyDown.emit(this.getEventObject(event));
      return;
    }
    let value = event.target.value.trim();
    if (!value)
      this.mdsDateTimePickerCore.clearDateTimePicker();
    else
      this.mdsDateTimePickerCore.setDateTimeByString(value);
    this.showDatePicker = false;
    this.textBoxKeyDown.emit(this.getEventObject(event));
  }

  clear() {
    if (this.inClearFunction || !this.mdsDateTimePickerCore) return;
    this.inClearFunction = true;
    this.myControl.setValue('');
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
  showDateTimePicker() {
    this.showDatePicker = true;
  }
  hideDateTimePicker() {
    this.showDatePicker = false;
  }

  //#region ControlValueAccessor

  private propagateChange: any = () => { };
  private valIMdsAngularDateTimePickerDateFn: any = () => { };

  writeValue(valueModel: IMdsAngularDateTimePickerDateModel): void {
    if (!valueModel || (!valueModel.selectedDate && !valueModel.selectedRangeDates)) {
      this.clear();
      return;
    }
    if (this.rangeSelector && valueModel.selectedRangeDates)
      this.selectedDateTimeRanges = [valueModel.selectedRangeDates.startDate.utcDateTime, valueModel.selectedRangeDates.endDate.utcDateTime];
    else if (valueModel.selectedDate)
      this.selectedDateTime = valueModel.selectedDate.utcDateTime;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {
    //this.disabled = isDisabled
    if (isDisabled)
      this.myControl.disable();
    else
      this.myControl.enable();
  }

  valIMdsAngularDateTimePickerDate(c: any) {
    return this.valIMdsAngularDateTimePickerDateFn(c.value);
  }

  //#endregion
}