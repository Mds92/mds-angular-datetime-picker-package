import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MdsDatetimePickerUtility } from '../assests/mds-datetime-picker.utility';
import { MdsDatetimePickerCoreComponent } from './core/mds-datetime-picker-core.component';
import { TextBoxTypeEnum, TemplateTypeEnum } from "../assests/Enums";
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
      this.selectedDateString = this.initialValue;
    }
    else
      this.selectedDateString = this.initialValue;
  }
  ngAfterViewInit() {
    this.afterViewInit = true;
  }

  @ViewChild('mdsDateTimePickerCore') mdsDateTimePickerCore: MdsDatetimePickerCoreComponent;

  @Input() templateType: TemplateTypeEnum = TemplateTypeEnum.bootstrap;
  @Input() textBoxType: TextBoxTypeEnum = TextBoxTypeEnum.withButton;
  @Input() initialValue = '';
  @Input() inLine = true;
  @Input() persianChar = true;
  @Input() rangeSelector = false;
  @Input() isPersian = true;
  @Input() timePicker = true;
  @Input() placeHolder = '';
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

  selectedDateString = '';
  get getTopOffset(): string {
    return (this.topOffset + 23) + 'px';
  }
  get getLeftOffset(): string {
    return this.leftOffset + 'px';
  }

  private topOffset = 0;
  private leftOffset = 0;
  private showDatePicker = false;
  private afterViewInit = false;
  private alreadyShowDatePickerClicked = false;
  private oldDateValue = '';

  @Output() dateChanged = new EventEmitter<IDate>();
  @Output() rangeDateChanged = new EventEmitter<IRangeDate>();

  dateChangedHandler(date: IDate) {
    if (!this.afterViewInit) return;
    this.selectedDateString = date.formatString;
    this.dateChanged.emit(date);
    this.showDatePicker = false;
  }
  rangeDateChangedHandler(rangeDate: IRangeDate) {
    if (!this.afterViewInit) return;
    this.selectedDateString = '';
    if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '')
      this.selectedDateString = `${rangeDate.startDate.formatString} - ${rangeDate.endDate.formatString}`;
    this.rangeDateChanged.emit(rangeDate);
    if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '')
      this.showDatePicker = false;
  }
  showDatePickerButtonClicked() {
    this.showDatePicker = !this.showDatePicker;
    this.initialValue = this.selectedDateString;
    this.alreadyShowDatePickerClicked = true;
    if (this.showDatePicker) {
      const rectObject = this.element.nativeElement.getBoundingClientRect();
      this.topOffset = rectObject.top;
      this.leftOffset = rectObject.left;
    }
  }
  dateTimeTextBoxOnFocus(event) {
    this.oldDateValue = event.target.value.trim();
    if(this.textBoxType == TextBoxTypeEnum.withoutButton)
      this.showDatePickerButtonClicked();
  }
  dateTimeTextBoxOnBlur(event) {
    if (this.alreadyShowDatePickerClicked && this.textBoxType == TextBoxTypeEnum.withButton) {
      this.alreadyShowDatePickerClicked = false;
      return;
    }
    this.alreadyShowDatePickerClicked = false;
    try {
      this.mdsDateTimePickerCore.setDateTimeByString(this.selectedDateString);
      if (this.isPersian && this.persianChar)
        this.selectedDateString = MdsDatetimePickerUtility.toPersianNumber(this.selectedDateString);
      else
        this.selectedDateString = MdsDatetimePickerUtility.toEnglishString(this.selectedDateString);
    } catch (e) {
      this.selectedDateString = this.oldDateValue;
      console.log(e);
    } 
  }
}