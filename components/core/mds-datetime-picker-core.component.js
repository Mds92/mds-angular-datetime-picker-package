"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var mds_datetime_picker_resources_service_1 = require("../../services/mds-datetime-picker-resources.service");
var mds_datetime_picker_utility_1 = require("../../assests/mds-datetime-picker.utility");
var enums_1 = require("../../assests/enums");
var mds_persian_datetime_1 = require("mds.persian.datetime");
var PersianDateTime = mds_persian_datetime_1.Mds.PersianDateTime;
var PersianDayOfWeek = mds_persian_datetime_1.Mds.PersianDayOfWeek;
var GregorianDayOfWeek = mds_persian_datetime_1.Mds.GregorianDayOfWeek;
var MdsDatetimePickerCoreComponent = (function () {
    function MdsDatetimePickerCoreComponent(resourcesService) {
        this.resourcesService = resourcesService;
        this.templateType = enums_1.TemplateTypeEnum.bootstrap;
        this.initialValue = '';
        this._persianChar = true;
        this._isPersian = true;
        this.rangeSelector = false;
        this.timePicker = false;
        this.format = '';
        this.dateChanged = new core_1.EventEmitter();
        this.rangeDateChanged = new core_1.EventEmitter();
        this.daysAnimationStateName = 'visible';
        this.monthOrYearSelectorVisibilityStateName = 'hidden';
        this.monthSelectorVisibilityStateName = 'hidden';
        this.yearSelectorVisibilityStateName = 'hidden';
        this._dateTime = null;
        this._persianDateTime = null;
        this._selectedDateTime = null;
        this._selectedPersianDateTime = null;
        this._selectedStartDateTime = null;
        this._selectedPersianStartDateTime = null;
        this._selectedEndDateTime = null;
        this._selectedPersianEndDateTime = null;
        this.startMdsPersianDateTimeToDateTemp = null;
        this.endMdsPersianDateTimeToDateTemp = null;
        this._resources = null;
        this._year = 0;
        this._yearString = '';
        this._month = 0;
        this._monthName = '';
        this._monthNames = [];
        this._hour = 0;
        this._hourString = '';
        this._minute = 0;
        this._minuteString = '';
        this._second = 0;
        this._secondString = '';
        this._weekdayNames = [];
        this._iDate = null;
        this._selectedRangeDatesObject = null;
    }
    MdsDatetimePickerCoreComponent.prototype.ngOnInit = function () {
        if (this.rangeSelector)
            this.timePicker = false;
        if (!this.isPersian)
            this.persianChar = false;
        if (this.initialValue != '') {
            if (this.rangeSelector) {
                try {
                    if (this.isPersian) {
                        var ranges = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.getPersianDateRanges(this.initialValue);
                        this.setSelectedRangePersianDateTimes(ranges);
                    }
                    else {
                        var ranges = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.getDateRanges(this.initialValue);
                        this.setSelectedRangeDateTimes(ranges);
                    }
                    this.dateTime = this.selectedStartDateTime;
                }
                catch (e) {
                    console.error('value is in wrong format, when rangeSelector is true you should write value like "1396/03/01 - 1396/03/15" or "2017/3/9 - 2017/3/10"', e);
                    this.setSelectedRangeDateTimes(null);
                    this.dateTime = null;
                }
            }
            else {
                try {
                    if (this.isPersian)
                        this.dateTime = PersianDateTime.parse(this.initialValue).toDate();
                    else
                        this.dateTime = new Date(Date.parse(this.initialValue));
                }
                catch (e) {
                    console.error('value is in wrong format, you should write value like "1396/03/01  11:30:27" or "2017/09/03  11:30:00", you can remove time', e);
                    this.dateTime = null;
                }
            }
        }
        else {
            this.dateTime = null;
        }
        this.updateYearsList();
        this.updateMonthDays();
        if (this.initialValue != '') {
            if (this.rangeSelector)
                this.fireRangeChangeEvent();
            else
                this.fireChangeEvent();
        }
    };
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "persianChar", {
        get: function () {
            return this._persianChar;
        },
        set: function (value) {
            if (this._persianChar == value)
                return;
            this._persianChar = value;
            this._yearString = '';
            this.resetMonthDaysWithContent();
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "isPersian", {
        get: function () {
            return this._isPersian;
        },
        set: function (value) {
            this._isPersian = value;
            this._monthName = '';
            this._monthNames = [];
            this._weekdayNames = [];
            this._resources = null;
            this._yearString = '';
            if (this.dateTime != null) {
                this.updateYearsList();
                this.updateMonthDays();
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    MdsDatetimePickerCoreComponent.prototype.splitStartEndDateString = function (dateString) {
        return dateString.split(' - ');
    };
    MdsDatetimePickerCoreComponent.prototype.setSelectedRangeDateTimes = function (dateTimes) {
        dateTimes = dateTimes == null || dateTimes.length < 2 ? [null, null] : dateTimes;
        this.selectedStartDateTime = dateTimes[0];
        this.selectedEndDateTime = dateTimes[1];
    };
    MdsDatetimePickerCoreComponent.prototype.setSelectedRangePersianDateTimes = function (persianDateTimes) {
        var ranges = [
            persianDateTimes[0] == null ? null : persianDateTimes[0].toDate(),
            persianDateTimes[1] == null ? null : persianDateTimes[1].toDate()
        ];
        this.setSelectedRangeDateTimes(ranges);
    };
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "persianStartDayOfMonth", {
        get: function () {
            return this.persianDateTime.startDayOfMonthDayOfWeek;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "gregorianStartDayOfMonth", {
        get: function () {
            return new Date(this.dateTime.getFullYear(), this.dateTime.getMonth(), 1).getDay();
        },
        enumerable: true,
        configurable: true
    });
    MdsDatetimePickerCoreComponent.prototype.clearTime = function (dateTime) {
        if (dateTime == null)
            return;
        dateTime.setHours(0, 0, 0, 0);
    };
    MdsDatetimePickerCoreComponent.prototype.getDateTimeFormat = function () {
        var format = this.format;
        if (format.trim() == '') {
            format = 'yyyy/MM/dd';
            if (this.timePicker && !this.rangeSelector)
                format += '   hh:mm:ss';
        }
        else if (this.rangeSelector || !this.timePicker)
            format = format.replace(/t*|f*|s*|m*|h*|H*/, '');
        return format;
    };
    MdsDatetimePickerCoreComponent.prototype.setDateTimeByDate = function (dateTime) {
        this.dateTime = this.selectedDateTime = dateTime;
        this.selectedStartDateTime = dateTime == null ? null : new Date(dateTime);
    };
    MdsDatetimePickerCoreComponent.prototype.setDateTimeRangesByDate = function (startDateTime, endDateTime) {
        this.dateTime = this.selectedDateTime = startDateTime;
        this.selectedStartDateTime = startDateTime == null ? null : new Date(startDateTime);
        this.selectedEndDateTime = endDateTime == null ? null : new Date(endDateTime);
    };
    MdsDatetimePickerCoreComponent.prototype.setDateTimeByString = function (dateTimeString) {
        try {
            if (dateTimeString == '') {
                this.clearDateTimePicker();
                return;
            }
            if (this.isPersian) {
                if (this.rangeSelector) {
                    var startAndEndDateArray = this.splitStartEndDateString(dateTimeString);
                    this.dateTime = this.selectedStartDateTime = PersianDateTime.parse(startAndEndDateArray[0]).toDate();
                    this.selectedEndDateTime = PersianDateTime.parse(startAndEndDateArray[1]).toDate();
                    if (this.selectedStartDateTime > this.selectedEndDateTime)
                        throw new Error('Start date must be less than end date');
                }
                else
                    this.dateTime = this.selectedDateTime = PersianDateTime.parse(dateTimeString).toDate();
            }
            else {
                if (this.rangeSelector) {
                    var startAndEndDateArray = this.splitStartEndDateString(dateTimeString);
                    this.dateTime = this.selectedStartDateTime = new Date(Date.parse(startAndEndDateArray[0]));
                    this.selectedEndDateTime = new Date(Date.parse(startAndEndDateArray[1]));
                    if (this.selectedStartDateTime > this.selectedEndDateTime)
                        throw new Error('Start date must be less than end date');
                }
                else
                    this.dateTime = this.selectedDateTime = new Date(Date.parse(dateTimeString));
            }
            if (this.rangeSelector)
                this.fireRangeChangeEvent();
            else
                this.fireChangeEvent();
            this.updateMonthDays();
        }
        catch (e) {
            this.clearDateTimePicker();
            throw new Error(e);
        }
    };
    MdsDatetimePickerCoreComponent.prototype.clearDateTimePicker = function () {
        this.dateTime = null;
        this.selectedDateTime = this.selectedStartDateTime = this.selectedEndDateTime = null;
        this.resetToFalseRangeParametersInMonthDays();
        if (this.rangeSelector)
            this.fireRangeChangeEvent();
        else
            this.fireChangeEvent();
        this.updateMonthDays();
    };
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "getSelectedDate", {
        get: function () {
            return this.getSelectedDateObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "getSelectedRangeDates", {
        get: function () {
            return this.getSelectedRangeDatesObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "dateTime", {
        get: function () {
            return this._dateTime;
        },
        set: function (dateTime) {
            this._dateTime = dateTime == null ? new Date() : new Date(dateTime);
            this._persianDateTime = null;
            this._year = this._month = 0;
            this._yearString = this._monthName = '';
            this._hour = this._minute = this._second = 0;
            this._hourString = this._minuteString = this._secondString = '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "persianDateTime", {
        get: function () {
            if (this.dateTime == null)
                return null;
            if (this._persianDateTime != null)
                return this._persianDateTime;
            this._persianDateTime = new PersianDateTime(this.dateTime);
            return this._persianDateTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedDateTime", {
        get: function () {
            return this._selectedDateTime;
        },
        set: function (dateTime) {
            this._selectedDateTime = dateTime == null ? null : new Date(dateTime);
            this._iDate = null;
            this._selectedPersianDateTime = null;
            if (this.rangeSelector || !this.timePicker)
                this.clearTime(dateTime);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedPersianDateTime", {
        get: function () {
            if (this._selectedPersianDateTime != null)
                return this._selectedPersianDateTime;
            this._selectedPersianDateTime = new PersianDateTime(this.selectedDateTime);
            return this._selectedPersianDateTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedStartDateTime", {
        get: function () {
            return this._selectedStartDateTime;
        },
        set: function (dateTime) {
            this._selectedStartDateTime = dateTime == null ? null : new Date(dateTime);
            this._selectedRangeDatesObject = null;
            this._selectedPersianStartDateTime = null;
            this.clearTime(dateTime);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedPersianStartDateTime", {
        get: function () {
            if (this._selectedPersianStartDateTime != null)
                return this._selectedPersianStartDateTime;
            this._selectedPersianStartDateTime = new PersianDateTime(this.selectedStartDateTime);
            return this._selectedPersianStartDateTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedEndDateTime", {
        get: function () {
            return this._selectedEndDateTime;
        },
        set: function (dateTime) {
            this._selectedEndDateTime = dateTime == null ? null : new Date(dateTime);
            this._selectedRangeDatesObject = null;
            this._selectedPersianEndDateTime = null;
            this.clearTime(dateTime);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedPersianEndDateTime", {
        get: function () {
            if (this._selectedPersianEndDateTime != null)
                return this._selectedPersianEndDateTime;
            this._selectedPersianEndDateTime = new PersianDateTime(this.selectedEndDateTime);
            return this._selectedPersianEndDateTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "resources", {
        get: function () {
            if (this._resources != null)
                return this._resources;
            if (this.isPersian)
                this._resources = this.resourcesService.persianResources;
            else
                this._resources = this.resourcesService.englishResources;
            return this._resources;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "year", {
        get: function () {
            if (this._year > 0)
                return this._year;
            this._year = this.isPersian
                ? this.persianDateTime.year
                : this.dateTime.getFullYear();
            return this._year;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "yearString", {
        get: function () {
            if (this._yearString != '')
                return this._yearString;
            this._yearString = this.persianChar
                ? mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this.year.toString())
                : this.dateTime.getFullYear().toString();
            return this._yearString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "month", {
        get: function () {
            if (this._month > 0)
                return this._month;
            this._month = this.isPersian
                ? PersianDateTime.getPersianMonthIndex(this.persianDateTime.monthName)
                : this.dateTime.getMonth();
            return this._month;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "monthName", {
        get: function () {
            if (this._monthName != '')
                return this._monthName;
            this._monthName = this.isPersian
                ? this.persianDateTime.monthName
                : PersianDateTime.getGregorianMonthNames[this.month];
            return this._monthName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "monthNames", {
        get: function () {
            if (this._monthNames != null && this._monthNames.length > 0)
                return this._monthNames;
            if (this.isPersian) {
                var allPersianMonths = PersianDateTime.getPersianMonthNames;
                this._monthNames = [
                    allPersianMonths[2], allPersianMonths[1], allPersianMonths[0],
                    allPersianMonths[5], allPersianMonths[4], allPersianMonths[3],
                    allPersianMonths[8], allPersianMonths[7], allPersianMonths[6],
                    allPersianMonths[11], allPersianMonths[10], allPersianMonths[9]
                ];
            }
            else {
                this._monthNames = PersianDateTime.getGregorianMonthNames;
            }
            return this._monthNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "hour", {
        get: function () {
            if (this._hour > 0)
                return this._hour;
            this._hour = this.dateTime.getHours();
            return this._hour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "hourString", {
        get: function () {
            if (this._hourString != '')
                return this._hourString;
            this._hourString = this.hour.toString();
            if (this.persianChar)
                this._hourString = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this._hourString);
            return this._hourString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "minute", {
        get: function () {
            if (this._minute > 0)
                return this._minute;
            this._minute = this.dateTime.getMinutes();
            return this._minute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "minuteString", {
        get: function () {
            if (this._minuteString != '')
                return this._minuteString;
            this._minuteString = this.minute.toString();
            if (this.persianChar)
                this._minuteString = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this._minuteString);
            return this._minuteString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "second", {
        get: function () {
            if (this._second > 0)
                return this._second;
            this._second = this.dateTime.getSeconds();
            return this._second;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "secondString", {
        get: function () {
            if (this._secondString != '')
                return this._secondString;
            this._secondString = this.second.toString();
            if (this.persianChar)
                this._secondString = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this._secondString);
            return this._secondString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "weekdayNames", {
        get: function () {
            if (this._weekdayNames != null && this._weekdayNames.length > 0)
                return this._weekdayNames;
            if (this.isPersian) {
                var persianWeekDayNames = PersianDateTime.getPersianWeekdayNames;
                this._weekdayNames = [
                    persianWeekDayNames[6][0], persianWeekDayNames[5][0], persianWeekDayNames[4][0],
                    persianWeekDayNames[3][0], persianWeekDayNames[2][0], persianWeekDayNames[1][0],
                    persianWeekDayNames[0][0]
                ];
            }
            else {
                var gregorianWeekDayNames = PersianDateTime.getGregorianWeekdayNames;
                this._weekdayNames = [
                    gregorianWeekDayNames[1][0] + gregorianWeekDayNames[1][1],
                    gregorianWeekDayNames[2][0] + gregorianWeekDayNames[2][1],
                    gregorianWeekDayNames[3][0] + gregorianWeekDayNames[3][1],
                    gregorianWeekDayNames[4][0] + gregorianWeekDayNames[4][1],
                    gregorianWeekDayNames[5][0] + gregorianWeekDayNames[5][1],
                    gregorianWeekDayNames[6][0] + gregorianWeekDayNames[6][1],
                    gregorianWeekDayNames[0][0] + gregorianWeekDayNames[0][1]
                ];
            }
            return this._weekdayNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "getSelectedDateObject", {
        get: function () {
            if (this.selectedDateTime == null)
                return null;
            if (this._iDate != null)
                return this._iDate;
            var format = this.getDateTimeFormat();
            if (this.isPersian) {
                this._iDate = {
                    year: this.selectedPersianDateTime.year,
                    month: this.selectedPersianDateTime.month,
                    day: this.selectedPersianDateTime.day,
                    hour: this.selectedPersianDateTime.hour,
                    minute: this.selectedPersianDateTime.minute,
                    second: this.selectedPersianDateTime.second,
                    millisecond: this.selectedPersianDateTime.millisecond,
                    formatString: this.selectedPersianDateTime.toString(format),
                    utcDateTime: this.selectedDateTime
                };
            }
            else {
                this._iDate = {
                    year: this.selectedDateTime.getFullYear(),
                    month: this.selectedDateTime.getMonth(),
                    day: this.selectedDateTime.getDate(),
                    hour: this.selectedDateTime.getHours(),
                    minute: this.selectedDateTime.getMinutes(),
                    second: this.selectedDateTime.getSeconds(),
                    millisecond: this.selectedDateTime.getMilliseconds(),
                    formatString: mds_datetime_picker_utility_1.MdsDatetimePickerUtility.dateTimeToString(this.selectedDateTime, format),
                    utcDateTime: this.selectedDateTime
                };
            }
            if (this.persianChar)
                this._iDate.formatString = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this._iDate.formatString);
            else
                this._iDate.formatString = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toEnglishString(this._iDate.formatString);
            return this._iDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "getSelectedDay", {
        get: function () {
            if (this.getSelectedDateObject == null || this.rangeSelector)
                return 0;
            return this.getSelectedDateObject.day;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "getSelectedRangeDatesObject", {
        get: function () {
            if (!this.rangeSelector || this.selectedStartDateTime == null && this.selectedEndDateTime == null)
                return null;
            if (this._selectedRangeDatesObject != null)
                return this._selectedRangeDatesObject;
            var format = this.getDateTimeFormat();
            var startDate;
            var endDate;
            if (this.isPersian) {
                startDate = {
                    year: this.selectedStartDateTime == null ? 0 : this.selectedPersianStartDateTime.year,
                    month: this.selectedStartDateTime == null ? 0 : this.selectedPersianStartDateTime.month,
                    day: this.selectedStartDateTime == null ? 0 : this.selectedPersianStartDateTime.day,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    formatString: this.selectedStartDateTime == null ? '' : this.selectedPersianStartDateTime.toString(format),
                    utcDateTime: this.selectedStartDateTime
                };
                endDate = {
                    year: this.selectedPersianEndDateTime == null ? 0 : this.selectedPersianEndDateTime.year,
                    month: this.selectedPersianEndDateTime == null ? 0 : this.selectedPersianEndDateTime.month,
                    day: this.selectedPersianEndDateTime == null ? 0 : this.selectedPersianEndDateTime.day,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    formatString: this.selectedPersianEndDateTime == null ? '' : this.selectedPersianEndDateTime.toString(format),
                    utcDateTime: this.selectedEndDateTime
                };
            }
            else {
                startDate = {
                    year: this.selectedStartDateTime == null ? 0 : this.selectedStartDateTime.getFullYear(),
                    month: this.selectedStartDateTime == null ? 0 : this.selectedStartDateTime.getMonth(),
                    day: this.selectedStartDateTime == null ? 0 : this.selectedStartDateTime.getDate(),
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    formatString: this.selectedStartDateTime == null ? '' : mds_datetime_picker_utility_1.MdsDatetimePickerUtility.dateTimeToString(this.selectedStartDateTime, format),
                    utcDateTime: this.selectedStartDateTime == null ? null : this.selectedStartDateTime
                };
                endDate = {
                    year: this.selectedEndDateTime == null ? 0 : this.selectedEndDateTime.getFullYear(),
                    month: this.selectedEndDateTime == null ? 0 : this.selectedEndDateTime.getMonth(),
                    day: this.selectedEndDateTime == null ? 0 : this.selectedEndDateTime.getDate(),
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                    formatString: this.selectedEndDateTime == null ? '' : mds_datetime_picker_utility_1.MdsDatetimePickerUtility.dateTimeToString(this.selectedEndDateTime, format),
                    utcDateTime: this.selectedEndDateTime == null ? null : this.selectedEndDateTime
                };
            }
            this._selectedRangeDatesObject = {
                startDate: startDate,
                endDate: endDate
            };
            return this._selectedRangeDatesObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "isRejectButtonDisable", {
        get: function () {
            return this.selectedStartDateTime == null && this.selectedEndDateTime == null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "isConfirmButtonDisable", {
        get: function () {
            return this.selectedStartDateTime == null || this.selectedEndDateTime == null;
        },
        enumerable: true,
        configurable: true
    });
    MdsDatetimePickerCoreComponent.prototype.updateYearsList = function () {
        this.yearsToSelect = [];
        var selectedYear = this.year;
        for (var i = selectedYear - 37; i <= selectedYear + 37; i++) {
            if (this.persianChar)
                this.yearsToSelect.push(mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(i.toString()));
            else
                this.yearsToSelect.push(i.toString());
        }
    };
    MdsDatetimePickerCoreComponent.prototype.getDayObject = function (year, month, day, disabled, holiday, isToday) {
        var isWithinDateRange = false;
        var isStartOrEndOfRange = false;
        if (this.rangeSelector && this.selectedStartDateTime != null) {
            var dateTime = this.isPersian
                ? PersianDateTime.fromPersianDate(year, month, day).toDate()
                : new Date(year, month, day);
            isWithinDateRange = dateTime >= this.selectedStartDateTime;
            if (this.selectedEndDateTime != null)
                isWithinDateRange = isWithinDateRange && dateTime <= this.selectedEndDateTime;
            isStartOrEndOfRange =
                (this.selectedStartDateTime != null && dateTime.getTime() == this.selectedStartDateTime.getTime()) ||
                    (this.selectedEndDateTime != null && dateTime.getTime() == this.selectedEndDateTime.getTime());
        }
        return {
            year: year,
            month: month,
            day: day,
            dayString: this.persianChar ? mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(day.toString()) : day.toString(),
            disable: disabled,
            holiday: holiday,
            today: isToday,
            isWithinRange: isWithinDateRange,
            isStartOrEndOfRange: isStartOrEndOfRange
        };
    };
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "isRangeSelectorReady", {
        get: function () {
            if (!this.rangeSelector)
                return false;
            if (this.selectedStartDateTime == null)
                return false;
            if (this.selectedStartDateTime != null && this.selectedEndDateTime != null)
                return false;
            return true;
        },
        enumerable: true,
        configurable: true
    });
    MdsDatetimePickerCoreComponent.prototype.updateMonthDays = function () {
        var days = [];
        var counter = 0, year = 0, month = 0;
        if (this.isPersian) {
            var persianDateTimeNow = PersianDateTime.now;
            var today = persianDateTimeNow.day;
            var isYearAndMonthInCurrentMonth = persianDateTimeNow.year == this.persianDateTime.year && persianDateTimeNow.month == this.persianDateTime.month;
            if (this.persianStartDayOfMonth != PersianDayOfWeek.Saturday) {
                var previousPersianMonth = this.persianDateTime.addMonths(-1);
                year = previousPersianMonth.year;
                month = previousPersianMonth.month;
                for (var i = previousPersianMonth.getMonthDays - this.persianStartDayOfMonth + 1; i <= previousPersianMonth.getMonthDays; i++) {
                    counter++;
                    days.push(this.getDayObject(year, month, i, true, false, false));
                }
            }
            year = this.persianDateTime.year;
            month = this.persianDateTime.month;
            for (var i = 1; i <= this.persianDateTime.getMonthDays; i++) {
                counter++;
                days.push(this.getDayObject(year, month, i, false, false, isYearAndMonthInCurrentMonth && i == today));
            }
            var nextMonthPersianDateTime = this.persianDateTime.addMonths(1);
            year = nextMonthPersianDateTime.year;
            month = nextMonthPersianDateTime.month;
            for (var i = 1; counter <= (6 * 7) - 1; i++) {
                counter++;
                days.push(this.getDayObject(year, month, i, true, false, false));
            }
            var temp = days.slice(0);
            for (var row = 0; row < 6; row++) {
                for (var column = 0; column < 7; column++) {
                    var index1 = row * 7 + column;
                    var index2 = Math.abs((row + 1) * 7 - (column + 1));
                    days[index1] = temp[index2];
                    if (column == 0)
                        days[index1].holiday = true;
                }
            }
        }
        else {
            var dateTimeNow = new Date();
            var today = dateTimeNow.getDate();
            var isYearAndMonthInCurrentMonth = dateTimeNow.getMonth() == this.dateTime.getMonth() && dateTimeNow.getFullYear() == this.dateTime.getFullYear();
            if (this.gregorianStartDayOfMonth != GregorianDayOfWeek.Saturday) {
                var dateTimeClone = new Date(this.dateTime);
                dateTimeClone.setMonth(this.dateTime.getMonth());
                year = dateTimeClone.getFullYear();
                month = dateTimeClone.getMonth();
                var previousMonthDays = new Date(dateTimeClone.getFullYear(), dateTimeClone.getMonth(), 0).getDate();
                for (var i = previousMonthDays - this.gregorianStartDayOfMonth + 1; i <= previousMonthDays; i++) {
                    counter++;
                    days.push(this.getDayObject(year, month - 1, i, true, false, false));
                }
            }
            year = this.dateTime.getFullYear();
            month = this.dateTime.getMonth();
            var currentMonthDays = new Date(year, month, 0).getDate();
            for (var i = 1; i <= currentMonthDays; i++) {
                counter++;
                days.push(this.getDayObject(year, month, i, false, false, isYearAndMonthInCurrentMonth && i == today));
            }
            var nextMonthDateTime = new Date(year, month + 1, 1);
            year = nextMonthDateTime.getFullYear();
            month = nextMonthDateTime.getMonth();
            for (var i = 1; counter <= (6 * 7) - 1; i++) {
                counter++;
                days.push(this.getDayObject(year, month, i, true, false, false));
            }
            for (var row = 0; row < 6; row++) {
                for (var column = 0; column < 7; column++) {
                    var index1 = row * 7 + column;
                    if (column == 0)
                        days[index1].holiday = true;
                }
            }
        }
        this.daysInMonth = days;
    };
    MdsDatetimePickerCoreComponent.prototype.fireChangeEvent = function () {
        this.dateChanged.emit(this.getSelectedDateObject);
    };
    MdsDatetimePickerCoreComponent.prototype.fireRangeChangeEvent = function () {
        this.rangeDateChanged.emit(this.getSelectedRangeDatesObject);
    };
    MdsDatetimePickerCoreComponent.prototype.resetToFalseRangeParametersInMonthDays = function () {
        for (var _i = 0, _a = this.daysInMonth; _i < _a.length; _i++) {
            var iday = _a[_i];
            iday.isWithinRange = false;
            iday.isStartOrEndOfRange = false;
        }
    };
    MdsDatetimePickerCoreComponent.prototype.resetMonthDaysWithContent = function () {
        if (this.daysInMonth == undefined)
            return;
        for (var _i = 0, _a = this.daysInMonth; _i < _a.length; _i++) {
            var iday = _a[_i];
            iday.isWithinRange = false;
            iday.isStartOrEndOfRange = false;
            iday.dayString = this.persianChar
                ? mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(iday.day.toString())
                : iday.day.toString();
        }
    };
    MdsDatetimePickerCoreComponent.prototype.hideSelecMonthAndYearBlock = function () {
        this.monthOrYearSelectorVisibilityStateName = 'hidden';
        this.monthSelectorVisibilityStateName = 'hidden';
        this.yearSelectorVisibilityStateName = 'hidden';
    };
    MdsDatetimePickerCoreComponent.prototype.resetIncompleteRanges = function () {
        if (this.selectedStartDateTime == null || this.selectedEndDateTime == null) {
            this.selectedStartDateTime = this.selectedEndDateTime = null;
            this._selectedPersianStartDateTime = this._selectedPersianEndDateTime = null;
            this.resetToFalseRangeParametersInMonthDays();
        }
    };
    MdsDatetimePickerCoreComponent.prototype.monthButtonOnClick = function () {
        this.monthOrYearSelectorVisibilityStateName = 'visible';
        this.monthSelectorVisibilityStateName = 'visible';
    };
    MdsDatetimePickerCoreComponent.prototype.selectYearButtonOnClick = function () {
        this.monthOrYearSelectorVisibilityStateName = 'visible';
        this.yearSelectorVisibilityStateName = 'visible';
    };
    MdsDatetimePickerCoreComponent.prototype.monthsBlockVisibilityAnimationDone = function () {
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.yearsBlockVisibilityAnimationDone = function () {
        this.updateYearsList();
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.nextYearButtonOnClick = function () {
        if (this.isPersian)
            this.dateTime = this.persianDateTime.addYears(1).toDate();
        else
            this.dateTime = new Date(this.dateTime.setFullYear(this.dateTime.getFullYear() + 1));
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.nextMonthButtonOnClick = function () {
        if (this.isPersian)
            this.dateTime = this.persianDateTime.addMonths(1).toDate();
        else
            this.dateTime = new Date(this.dateTime.setMonth(this.dateTime.getMonth() + 1));
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.previousMonthButtonOnClick = function () {
        if (this.isPersian)
            this.dateTime = this.persianDateTime.addMonths(-1).toDate();
        else
            this.dateTime = new Date(this.dateTime.setMonth(this.dateTime.getMonth() - 1));
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.previousYearButtonOnClick = function () {
        if (this.isPersian)
            this.dateTime = this.persianDateTime.addYears(-1).toDate();
        else
            this.dateTime = new Date(this.dateTime.setFullYear(this.dateTime.getFullYear() - 1));
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.hourUpButtonOnClick = function () {
        this.dateTime = new Date(this.dateTime.setHours(this.dateTime.getHours() + 1));
    };
    MdsDatetimePickerCoreComponent.prototype.hourDownButtonOnClick = function () {
        this.dateTime = new Date(this.dateTime.setHours(this.dateTime.getHours() - 1));
    };
    MdsDatetimePickerCoreComponent.prototype.minuteUpButtonOnClick = function () {
        this.dateTime = new Date(this.dateTime.setMinutes(this.dateTime.getMinutes() + 1));
    };
    MdsDatetimePickerCoreComponent.prototype.minuteDownButtonOnClick = function () {
        this.dateTime = new Date(this.dateTime.setMinutes(this.dateTime.getMinutes() - 1));
    };
    MdsDatetimePickerCoreComponent.prototype.secondUpButtonOnClick = function () {
        this.dateTime = new Date(this.dateTime.setSeconds(this.dateTime.getSeconds() + 1));
    };
    MdsDatetimePickerCoreComponent.prototype.secondDownButtonOnClick = function () {
        this.dateTime = new Date(this.dateTime.setSeconds(this.dateTime.getSeconds() - 1));
    };
    MdsDatetimePickerCoreComponent.prototype.monthOnClick = function (selectedMonthName) {
        var monthIndex = this.isPersian
            ? PersianDateTime.getPersianMonthIndex(selectedMonthName)
            : PersianDateTime.getGregorianMonthNameIndex(selectedMonthName);
        if (this.isPersian)
            this.dateTime = this.persianDateTime.setPersianMonth(monthIndex + 1).toDate();
        else {
            var dateTimeClone = new Date(this.dateTime);
            dateTimeClone.setMonth(monthIndex);
            this.dateTime = new Date(dateTimeClone);
        }
        this.hideSelecMonthAndYearBlock();
    };
    MdsDatetimePickerCoreComponent.prototype.yearOnClick = function (selectedYear) {
        var year = this.isPersian ? Number(mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toEnglishNumber(selectedYear)) : Number(selectedYear);
        if (this.isPersian)
            this.dateTime = this.persianDateTime.setPersianYear(year).toDate();
        else {
            var dateTimeClone = new Date(this.dateTime);
            dateTimeClone.setFullYear(year);
            this.dateTime = new Date(dateTimeClone);
        }
        this.hideSelecMonthAndYearBlock();
    };
    MdsDatetimePickerCoreComponent.prototype.todayButtonOnClick = function () {
        var dateTimeNow = new Date();
        if (this.dateTime.getFullYear() != dateTimeNow.getFullYear() || this.dateTime.getMonth() != dateTimeNow.getMonth()) {
            this.dateTime = dateTimeNow;
            this.updateMonthDays();
        }
        else
            this.dateTime = dateTimeNow;
        this.selectedDateTime = dateTimeNow;
        if (!this.rangeSelector)
            this.fireChangeEvent();
    };
    MdsDatetimePickerCoreComponent.prototype.dayButtonOnClick = function (dayObject) {
        if (dayObject.disable) {
            if (this.isPersian)
                this.dateTime = PersianDateTime.fromPersianDate(dayObject.year, dayObject.month, dayObject.day).toDate();
            else {
                var dateTimeClone = new Date(this.dateTime);
                dateTimeClone.setDate(dayObject.day);
                dateTimeClone.setMonth(dayObject.month);
                dateTimeClone.setFullYear(dayObject.year);
                this.dateTime = dateTimeClone;
            }
            this.updateMonthDays();
            return;
        }
        if (this.rangeSelector && this.selectedStartDateTime != null && this.selectedEndDateTime != null) {
            this.selectedStartDateTime = null;
            this.selectedEndDateTime = null;
            this.resetToFalseRangeParametersInMonthDays();
        }
        this.selectedDateTime = this.isPersian
            ? PersianDateTime.fromPersianDateTime(dayObject.year, dayObject.month, dayObject.day, this.hour, this.minute, this.second, 0).toDate()
            : new Date(dayObject.year, dayObject.month, dayObject.day, this.hour, this.minute, this.second);
        if (this.rangeSelector) {
            if (this.selectedStartDateTime == null || this.selectedStartDateTime >= this.selectedDateTime) {
                this.resetToFalseRangeParametersInMonthDays();
                this.selectedStartDateTime = this.selectedDateTime;
                dayObject.isStartOrEndOfRange = true;
            }
            else {
                this.selectedEndDateTime = this.selectedDateTime;
                dayObject.isStartOrEndOfRange = true;
            }
        }
        if (this.rangeSelector && this.selectedStartDateTime != null && this.selectedEndDateTime != null)
            this.fireRangeChangeEvent();
        else if (!this.rangeSelector)
            this.fireChangeEvent();
    };
    MdsDatetimePickerCoreComponent.prototype.dayButtonOnHover = function (dayObject) {
        if (!this.isRangeSelectorReady)
            return;
        var hoverCellDate = this.isPersian
            ? PersianDateTime.fromPersianDate(dayObject.year, dayObject.month, dayObject.day).toDate()
            : new Date(dayObject.year, dayObject.month, dayObject.day);
        for (var _i = 0, _a = this.daysInMonth; _i < _a.length; _i++) {
            var iday = _a[_i];
            var currentDate = this.isPersian
                ? PersianDateTime.fromPersianDate(iday.year, iday.month, iday.day).toDate()
                : new Date(iday.year, iday.month, iday.day);
            iday.isWithinRange = currentDate >= this.selectedStartDateTime && currentDate <= hoverCellDate;
        }
    };
    MdsDatetimePickerCoreComponent.prototype.rejectButtonOnClick = function () {
        this.selectedDateTime = null;
        this.selectedStartDateTime = this.selectedEndDateTime = null;
        this.resetToFalseRangeParametersInMonthDays();
        this.fireRangeChangeEvent();
    };
    MdsDatetimePickerCoreComponent.prototype.confirmButtonOnClick = function () {
        if (this.selectedStartDateTime != null && this.selectedEndDateTime != null)
            this.fireRangeChangeEvent();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MdsDatetimePickerCoreComponent.prototype, "templateType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerCoreComponent.prototype, "initialValue", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MdsDatetimePickerCoreComponent.prototype, "persianChar", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MdsDatetimePickerCoreComponent.prototype, "isPersian", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerCoreComponent.prototype, "rangeSelector", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerCoreComponent.prototype, "timePicker", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MdsDatetimePickerCoreComponent.prototype, "format", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerCoreComponent.prototype, "dateChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerCoreComponent.prototype, "rangeDateChanged", void 0);
    MdsDatetimePickerCoreComponent = __decorate([
        core_1.Component({
            selector: 'mds-datetime-picker-core',
            templateUrl: './mds-datetime-picker-core.component.html',
            styleUrls: ['./mds-datetime-picker-core.component.css'],
            animations: [
                animations_1.trigger('daysStateName', [
                    animations_1.transition('void => *', [
                        animations_1.style({ transform: 'rotateY(90deg)' }),
                        animations_1.animate('200ms ease-in')
                    ])
                ]),
                animations_1.trigger('monthAndYearSelectorVisibility', [
                    animations_1.state('visible', animations_1.style({ opacity: 1, transform: 'rotateY(0deg)' })),
                    animations_1.state('hidden', animations_1.style({ opacity: 0, transform: 'rotateY(90deg)' })),
                    animations_1.transition('hidden => visible', [animations_1.animate('0.2s ease-in')]),
                    animations_1.transition('visible => hidden', [animations_1.animate('0.2s ease-out')])
                ])
            ]
        }),
        __metadata("design:paramtypes", [mds_datetime_picker_resources_service_1.MdsDatetimePickerResourcesService])
    ], MdsDatetimePickerCoreComponent);
    return MdsDatetimePickerCoreComponent;
}());
exports.MdsDatetimePickerCoreComponent = MdsDatetimePickerCoreComponent;
//# sourceMappingURL=mds-datetime-picker-core.component.js.map