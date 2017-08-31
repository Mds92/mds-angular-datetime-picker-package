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
var mds_persian_datetime_1 = require("mds.persian.datetime");
var PersianDateTime = mds_persian_datetime_1.Mds.PersianDateTime;
var PersianDayOfWeek = mds_persian_datetime_1.Mds.PersianDayOfWeek;
var GregorianDayOfWeek = mds_persian_datetime_1.Mds.GregorianDayOfWeek;
var Enums_1 = require("../../assests/Enums");
var MdsDatetimePickerCoreComponent = (function () {
    function MdsDatetimePickerCoreComponent(resourcesService) {
        this.resourcesService = resourcesService;
        this.templateType = Enums_1.TemplateTypeEnum.bootstrap;
        this.initialValue = '';
        this.persianChar = true;
        this.isPersian = true;
        this.rangeSelector = false;
        this.timePicker = false;
        this.format = '';
        this.dateChanged = new core_1.EventEmitter();
        this.rangeDateChanged = new core_1.EventEmitter();
        this.daysAnimationStateName = 'visible';
        this.monthOrYearSelectorVisibilityStateName = 'hidden';
        this.monthSelectorVisibilityStateName = 'hidden';
        this.yearSelectorVisibilityStateName = 'hidden';
        this.startMdsPersianDateTime = null;
        this.endMdsPersianDateTime = null;
        this.startMdsPersianDateTimeToDateTemp = null;
        this.endMdsPersianDateTimeToDateTemp = null;
        this.startDateTime = null;
        this.endDateTime = null;
    }
    MdsDatetimePickerCoreComponent.prototype.ngOnInit = function () {
        if (this.rangeSelector)
            this.timePicker = false;
        if (!this.isPersian)
            this.persianChar = false;
        if (this.format == '') {
            this.format = 'yyyy/MM/dd';
            if (this.timePicker && !this.rangeSelector)
                this.format += '   hh:mm:ss';
        }
        if (this.initialValue != '') {
            if (this.rangeSelector) {
                try {
                    if (this.isPersian)
                        _a = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.getPersianDateRanges(this.initialValue), this.startMdsPersianDateTime = _a[0], this.endMdsPersianDateTime = _a[1];
                    else
                        _b = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.getDateRanges(this.initialValue), this.startDateTime = _b[0], this.endDateTime = _b[1];
                    this.mdsPersianDateTime = this.startMdsPersianDateTime;
                    this.dateTime = this.startDateTime;
                }
                catch (e) {
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
                }
                catch (e) {
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
        }
        else {
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
        var _a, _b;
    };
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedYear", {
        get: function () {
            if (this.isPersian)
                return this.mdsPersianDateTime.year;
            return this.dateTime.getFullYear();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedYearString", {
        get: function () {
            if (this.isPersian)
                return mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this.selectedYear.toString());
            return this.dateTime.getFullYear().toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedMonth", {
        get: function () {
            if (this.isPersian)
                return PersianDateTime.getPersianMonthIndex(this.selectedMonthName);
            return this.dateTime.getMonth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedMonthName", {
        get: function () {
            if (this.isPersian)
                return this.mdsPersianDateTime.monthName;
            return PersianDateTime.getGregorianMonthNames[this.selectedMonth];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "selectedDay", {
        get: function () {
            if (this.rangeSelector)
                return 0;
            if (this.isPersian)
                return this.mdsPersianDateTime.day;
            return this.dateTime.getDate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "monthNames", {
        get: function () {
            if (this.isPersian) {
                var allPersianMonths = PersianDateTime.getPersianMonthNames;
                return [
                    allPersianMonths[2], allPersianMonths[1], allPersianMonths[0],
                    allPersianMonths[5], allPersianMonths[4], allPersianMonths[3],
                    allPersianMonths[8], allPersianMonths[7], allPersianMonths[6],
                    allPersianMonths[11], allPersianMonths[10], allPersianMonths[9]
                ];
            }
            else {
                return PersianDateTime.getGregorianMonthNames;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "weekdayNames", {
        get: function () {
            if (this.isPersian) {
                var persianWeekDayNames = PersianDateTime.getPersianWeekdayNames;
                return [
                    persianWeekDayNames[6][0], persianWeekDayNames[5][0], persianWeekDayNames[4][0], persianWeekDayNames[3][0], persianWeekDayNames[2][0], persianWeekDayNames[1][0],
                    persianWeekDayNames[0][0]
                ];
            }
            else {
                var gregorianWeekDayNames = PersianDateTime.getGregorianWeekdayNames;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "hour", {
        get: function () {
            if (this.isPersian) {
                if (this.persianChar)
                    return mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this.mdsPersianDateTime.hour.toString());
                return this.mdsPersianDateTime.hour.toString();
            }
            return this.dateTime.getHours().toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "minute", {
        get: function () {
            if (this.isPersian) {
                if (this.persianChar)
                    return mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this.mdsPersianDateTime.minute.toString());
                return this.mdsPersianDateTime.minute.toString();
            }
            return this.dateTime.getMinutes().toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "second", {
        get: function () {
            if (this.isPersian) {
                if (this.persianChar)
                    return mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this.mdsPersianDateTime.second.toString());
                return this.mdsPersianDateTime.second.toString();
            }
            return this.dateTime.getSeconds().toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "isRejectButtonDisable", {
        get: function () {
            if (this.isPersian)
                return this.startMdsPersianDateTime == null && this.endMdsPersianDateTime == null;
            else
                return this.startDateTime == null && this.endDateTime == null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "isConfirmButtonDisable", {
        get: function () {
            if (this.isPersian)
                return this.startMdsPersianDateTime == null || this.endMdsPersianDateTime == null;
            else
                return this.startDateTime == null || this.endDateTime == null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerCoreComponent.prototype, "persianStartDayOfMonth", {
        get: function () {
            return this.mdsPersianDateTime.startDayOfMonthDayOfWeek;
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
    MdsDatetimePickerCoreComponent.prototype.updateYearsListForToSelect = function () {
        this.yearsToSelect = new Array();
        var selectedYear = this.isPersian ? this.mdsPersianDateTime.year : this.dateTime.getFullYear();
        for (var i = selectedYear - 37; i <= selectedYear + 37; i++) {
            if (this.isPersian)
                this.yearsToSelect.push(mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(i.toString()));
            else
                this.yearsToSelect.push(i.toString());
        }
    };
    MdsDatetimePickerCoreComponent.prototype.getDayObject = function (year, month, day, disabled, holiday, isToday) {
        var isWithinDateRange = false;
        var isStartOrEndOfRange = false;
        if (this.rangeSelector &&
            (this.isPersian && this.startMdsPersianDateTime != null) ||
            (!this.isPersian && this.startDateTime != null)) {
            if (this.isPersian) {
                var persianDateTime = PersianDateTime.fromPersianDate(year, month, day).toDate();
                isWithinDateRange = persianDateTime >= this.startMdsPersianDateTimeToDateTemp;
                if (this.endMdsPersianDateTime != null)
                    isWithinDateRange = isWithinDateRange && persianDateTime <= this.endMdsPersianDateTimeToDateTemp;
                isStartOrEndOfRange =
                    (this.startMdsPersianDateTimeToDateTemp != null && persianDateTime.getTime() == this.startMdsPersianDateTimeToDateTemp.getTime()) ||
                        (this.endMdsPersianDateTimeToDateTemp != null && persianDateTime.getTime() == this.endMdsPersianDateTimeToDateTemp.getTime());
            }
            else {
                var dateTime = new Date(year, month, day);
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
            dayString: this.persianChar ? mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(day.toString()) : day.toString(),
            disable: disabled,
            holiday: holiday,
            today: isToday,
            isWithinRange: isWithinDateRange,
            isStartOrEndOfRange: isStartOrEndOfRange
        };
    };
    MdsDatetimePickerCoreComponent.prototype.isRangeSelectorReady = function () {
        if (!this.rangeSelector)
            return false;
        if ((this.isPersian && this.startMdsPersianDateTime == null) || (!this.isPersian && this.startDateTime == null))
            return false;
        if (this.isPersian && this.startMdsPersianDateTime != null && this.endMdsPersianDateTime != null)
            return false;
        if (!this.isPersian && this.startDateTime != null && this.endDateTime != null)
            return false;
        return true;
    };
    MdsDatetimePickerCoreComponent.prototype.getDate = function () {
        var iDate;
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
                formatString: mds_datetime_picker_utility_1.MdsDatetimePickerUtility.dateTimeToString(this.dateTime),
                utcDateTime: this.mdsPersianDateTime.toDate()
            };
        }
        if (this.persianChar)
            iDate.formatString = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(iDate.formatString);
        else
            iDate.formatString = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toEnglishString(iDate.formatString);
        return iDate;
    };
    MdsDatetimePickerCoreComponent.prototype.updateMonthDays = function () {
        var days = new Array();
        var counter = 0, year = 0, month = 0;
        this.startMdsPersianDateTimeToDateTemp = this.startMdsPersianDateTime != null ? this.startMdsPersianDateTime.toDate() : null;
        this.endMdsPersianDateTimeToDateTemp = this.endMdsPersianDateTime != null ? this.endMdsPersianDateTime.toDate() : null;
        if (this.isPersian) {
            var persianDateTimeNow = PersianDateTime.now;
            var today = persianDateTimeNow.day;
            var isYearAndMonthInCurrentMonth = persianDateTimeNow.year == this.mdsPersianDateTime.year && persianDateTimeNow.month == this.mdsPersianDateTime.month;
            if (this.persianStartDayOfMonth != PersianDayOfWeek.Saturday) {
                var previousPersianMonth = this.mdsPersianDateTime.addMonths(-1);
                year = previousPersianMonth.year;
                month = previousPersianMonth.month;
                for (var i = previousPersianMonth.getMonthDays - this.persianStartDayOfMonth + 1; i <= previousPersianMonth.getMonthDays; i++) {
                    counter++;
                    days.push(this.getDayObject(year, month, i, true, false, false));
                }
            }
            year = this.mdsPersianDateTime.year;
            month = this.mdsPersianDateTime.month;
            for (var i = 1; i <= this.mdsPersianDateTime.getMonthDays; i++) {
                counter++;
                days.push(this.getDayObject(year, month, i, false, false, isYearAndMonthInCurrentMonth && i == today));
            }
            var nextMonthPersianDateTime = this.mdsPersianDateTime.addMonths(1);
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
            var isYearAndMonthInCurrentMonth = dateTimeNow.getMonth() == this.dateTime.getMonth() &&
                dateTimeNow.getFullYear() == this.dateTime.getFullYear();
            if (this.gregorianStartDayOfMonth != GregorianDayOfWeek.Saturday) {
                var dateTimeClone = new Date(this.dateTime.getTime());
                dateTimeClone.setMonth(this.dateTime.getMonth() - 1);
                year = dateTimeClone.getFullYear();
                month = dateTimeClone.getMonth();
                var previousMonthDays = new Date(dateTimeClone.getFullYear(), dateTimeClone.getMonth(), 0).getDate();
                for (var i = previousMonthDays - this.gregorianStartDayOfMonth + 1; i <= previousMonthDays; i++) {
                    counter++;
                    days.push(this.getDayObject(year, month, i, true, false, false));
                }
            }
            year = this.dateTime.getFullYear();
            month = this.dateTime.getMonth();
            var currentMonthDays = new Date(year, month, 0).getDate();
            for (var i = 1; i <= currentMonthDays; i++) {
                counter++;
                days.push(this.getDayObject(year, month, i, false, false, isYearAndMonthInCurrentMonth && i == today));
            }
            var nectMonthDateTime = new Date(year, month + 1, 1);
            year = nectMonthDateTime.getFullYear();
            month = nectMonthDateTime.getMonth();
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
        this.dateChanged.emit(this.getDate());
    };
    MdsDatetimePickerCoreComponent.prototype.fireRangeChangeEvent = function () {
        var startDate;
        var endDate;
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
            };
        }
        else {
            startDate = {
                year: this.startDateTime == null ? 0 : this.startDateTime.getFullYear(),
                month: this.startDateTime == null ? 0 : this.startDateTime.getMonth(),
                day: this.startDateTime == null ? 0 : this.startDateTime.getDate(),
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
                formatString: this.startDateTime == null ? '' : mds_datetime_picker_utility_1.MdsDatetimePickerUtility.dateTimeToString(this.startDateTime, this.format),
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
                formatString: this.endDateTime == null ? '' : mds_datetime_picker_utility_1.MdsDatetimePickerUtility.dateTimeToString(this.endDateTime, this.format),
                utcDateTime: this.endDateTime == null ? null : this.endDateTime,
            };
        }
        this.rangeDateChanged.emit({
            startDate: startDate,
            endDate: endDate
        });
    };
    MdsDatetimePickerCoreComponent.prototype.getStartEndDate = function (dateString) {
        return dateString.split(' - ');
    };
    MdsDatetimePickerCoreComponent.prototype.resetToFalseRangeParametersInMonthDays = function () {
        for (var _i = 0, _a = this.daysInMonth; _i < _a.length; _i++) {
            var iday = _a[_i];
            iday.isWithinRange = false;
            iday.isStartOrEndOfRange = false;
        }
    };
    MdsDatetimePickerCoreComponent.prototype.hideSelecMonthAndYearBlock = function () {
        this.monthOrYearSelectorVisibilityStateName = 'hidden';
        this.monthSelectorVisibilityStateName = 'hidden';
        this.yearSelectorVisibilityStateName = 'hidden';
    };
    MdsDatetimePickerCoreComponent.prototype.resetIncompleteRanges = function () {
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
    };
    MdsDatetimePickerCoreComponent.prototype.setDateTime = function (date) {
        if (this.isPersian) {
            this.mdsPersianDateTime = PersianDateTime.fromPersianDateTime(date.year, date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
            this.dateTime = this.mdsPersianDateTime.toDate();
        }
        else {
            this.dateTime = new Date(date.year, date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
            this.mdsPersianDateTime = new PersianDateTime(this.dateTime);
        }
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.setDateTimeByString = function (dateTimeString) {
        try {
            if (dateTimeString == '')
                return;
            if (this.isPersian) {
                if (this.rangeSelector) {
                    var startAndEndDateArray = this.getStartEndDate(dateTimeString);
                    this.startMdsPersianDateTime = PersianDateTime.parse(startAndEndDateArray[0]);
                    this.endMdsPersianDateTime = PersianDateTime.parse(startAndEndDateArray[1]);
                    if (this.startMdsPersianDateTime.toDate() > this.endMdsPersianDateTime.toDate())
                        throw new Error('start date must be less than end date');
                }
                else {
                    this.mdsPersianDateTime = PersianDateTime.parse(dateTimeString);
                    this.dateTime = this.mdsPersianDateTime.toDate();
                }
            }
            else {
                if (this.rangeSelector) {
                    var startAndEndDateArray = this.getStartEndDate(dateTimeString);
                    this.startDateTime = new Date(Date.parse(startAndEndDateArray[0]));
                    this.endDateTime = new Date(Date.parse(startAndEndDateArray[1]));
                    if (this.startDateTime > this.endDateTime)
                        throw new Error('start date must be less than end date');
                }
                else {
                    this.dateTime = new Date(Date.parse(dateTimeString));
                    this.mdsPersianDateTime = new PersianDateTime(this.dateTime);
                }
            }
            this.updateMonthDays();
        }
        catch (e) {
            throw new Error(e);
        }
    };
    MdsDatetimePickerCoreComponent.prototype.selectMonthButtonOnClick = function () {
        this.monthOrYearSelectorVisibilityStateName = 'visible';
        this.monthSelectorVisibilityStateName = 'visible';
    };
    MdsDatetimePickerCoreComponent.prototype.selectYearButtonOnClick = function () {
        this.monthOrYearSelectorVisibilityStateName = 'visible';
        this.yearSelectorVisibilityStateName = 'visible';
    };
    MdsDatetimePickerCoreComponent.prototype.monthsBlockVisibilityAnimationDone = function (e) {
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.yearsBlockVisibilityAnimationDone = function (e) {
        this.updateYearsListForToSelect();
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.nextYearButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addYears(1);
        else
            this.dateTime.setFullYear(this.dateTime.getFullYear() + 1);
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.nextMonthButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addMonths(1);
        else
            this.dateTime.setMonth(this.dateTime.getMonth() + 1);
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.previousMonthButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addMonths(-1);
        else
            this.dateTime.setMonth(this.dateTime.getMonth() - 1);
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.previousYearButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addYears(-1);
        else
            this.dateTime.setFullYear(this.dateTime.getFullYear() - 1);
        this.updateMonthDays();
    };
    MdsDatetimePickerCoreComponent.prototype.hourUpButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addHours(1);
        else
            this.dateTime.setHours(this.dateTime.getHours() + 1);
    };
    MdsDatetimePickerCoreComponent.prototype.hourDownButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addHours(-1);
        else
            this.dateTime.setHours(this.dateTime.getHours() - 1);
    };
    MdsDatetimePickerCoreComponent.prototype.minuteUpButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addMinutes(1);
        else
            this.dateTime.setMinutes(this.dateTime.getMinutes() + 1);
    };
    MdsDatetimePickerCoreComponent.prototype.minuteDownButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addMinutes(-1);
        else
            this.dateTime.setMinutes(this.dateTime.getMinutes() - 1);
    };
    MdsDatetimePickerCoreComponent.prototype.secondUpButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addSeconds(1);
        else
            this.dateTime.setSeconds(this.dateTime.getSeconds() + 1);
    };
    MdsDatetimePickerCoreComponent.prototype.secondDownButtonOnClick = function () {
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.addSeconds(-1);
        else
            this.dateTime.setSeconds(this.dateTime.getSeconds() - 1);
    };
    MdsDatetimePickerCoreComponent.prototype.monthOnClick = function (selectedMonthName) {
        var monthIndex = this.isPersian ? PersianDateTime.getPersianMonthIndex(selectedMonthName) : PersianDateTime.getGregorianMonthNameIndex(selectedMonthName);
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianMonth(monthIndex + 1);
        else {
            var dateTimeClone = new Date(this.dateTime.getTime());
            dateTimeClone.setMonth(monthIndex);
            this.dateTime = new Date(dateTimeClone.getTime());
        }
        this.hideSelecMonthAndYearBlock();
    };
    MdsDatetimePickerCoreComponent.prototype.yearOnClick = function (selectedYear) {
        var year = this.isPersian ? Number(mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toEnglishNumber(selectedYear)) : Number(selectedYear);
        if (this.isPersian)
            this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianYear(year);
        else {
            var dateTimeClone = new Date(this.dateTime.getTime());
            dateTimeClone.setFullYear(year);
            this.dateTime = new Date(dateTimeClone.getTime());
        }
        this.hideSelecMonthAndYearBlock();
    };
    MdsDatetimePickerCoreComponent.prototype.todayButtonOnClick = function () {
        var persianDateTimeNow = PersianDateTime.now;
        var dateTimeNow = new Date();
        if ((this.isPersian && (this.mdsPersianDateTime.year != persianDateTimeNow.year || this.mdsPersianDateTime.month != persianDateTimeNow.month)) ||
            (!this.isPersian && (this.dateTime.getFullYear() != dateTimeNow.getFullYear() || this.dateTime.getMonth() != dateTimeNow.getMonth()))) {
            this.mdsPersianDateTime = persianDateTimeNow;
            this.dateTime = dateTimeNow;
            this.updateMonthDays();
        }
        else {
            this.mdsPersianDateTime = persianDateTimeNow;
            this.dateTime = dateTimeNow;
        }
        if (!this.rangeSelector)
            this.fireChangeEvent();
    };
    MdsDatetimePickerCoreComponent.prototype.dayButtonOnClick = function (dayObject) {
        if (dayObject.disable) {
            if (this.isPersian) {
                this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianDate(dayObject.year, dayObject.month, dayObject.day);
            }
            else {
                var dateTimeClone = new Date(this.dateTime.getTime());
                dateTimeClone.setDate(dayObject.day);
                dateTimeClone.setMonth(dayObject.month);
                dateTimeClone.setFullYear(dayObject.year);
                this.dateTime = new Date(dateTimeClone);
            }
            this.updateMonthDays();
            return;
        }
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
        if (this.isPersian) {
            this.mdsPersianDateTime = this.mdsPersianDateTime.setPersianDate(dayObject.year, dayObject.month, dayObject.day);
            if (this.rangeSelector)
                if (this.startMdsPersianDateTime == null ||
                    this.startMdsPersianDateTime.toDate() >= this.mdsPersianDateTime.toDate()) {
                    this.startMdsPersianDateTime = this.mdsPersianDateTime.date.clone();
                    this.resetToFalseRangeParametersInMonthDays();
                    dayObject.isStartOrEndOfRange = true;
                }
                else {
                    this.endMdsPersianDateTime = this.mdsPersianDateTime.date.clone();
                    dayObject.isStartOrEndOfRange = true;
                }
        }
        else {
            var dateTimeClone = new Date(this.dateTime.getTime());
            dateTimeClone.setDate(dayObject.day);
            dateTimeClone.setMonth(dayObject.month);
            dateTimeClone.setFullYear(dayObject.year);
            this.dateTime = new Date(dateTimeClone.getTime());
            if (this.rangeSelector)
                if (this.startDateTime == null || this.startDateTime >= this.dateTime) {
                    this.startDateTime = new Date(dateTimeClone.getFullYear(), dateTimeClone.getMonth(), dateTimeClone.getDate());
                    this.resetToFalseRangeParametersInMonthDays();
                    dayObject.isStartOrEndOfRange = true;
                }
                else {
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
    };
    MdsDatetimePickerCoreComponent.prototype.dayButtonOnHover = function (dayObject) {
        if (!this.isRangeSelectorReady())
            return;
        var hoverCellDate;
        var startDate;
        if (this.isPersian) {
            startDate = this.startMdsPersianDateTime.toDate();
            hoverCellDate = PersianDateTime.fromPersianDate(dayObject.year, dayObject.month, dayObject.day).toDate();
        }
        else {
            startDate = this.startDateTime;
            hoverCellDate = new Date(dayObject.year, dayObject.month, dayObject.day);
        }
        for (var _i = 0, _a = this.daysInMonth; _i < _a.length; _i++) {
            var iday = _a[_i];
            var currentDate = void 0;
            if (this.isPersian)
                currentDate = PersianDateTime.fromPersianDate(iday.year, iday.month, iday.day).toDate();
            else
                currentDate = new Date(iday.year, iday.month, iday.day);
            iday.isWithinRange = currentDate >= startDate && currentDate <= hoverCellDate;
        }
    };
    MdsDatetimePickerCoreComponent.prototype.rejectButtonOnClick = function () {
        this.startDateTime = null;
        this.endDateTime = null;
        this.startMdsPersianDateTime = null;
        this.endMdsPersianDateTime = null;
        this.resetToFalseRangeParametersInMonthDays();
        this.fireRangeChangeEvent();
    };
    MdsDatetimePickerCoreComponent.prototype.confirmButtonOnClick = function () {
        if ((this.isPersian && this.startMdsPersianDateTime != null && this.endMdsPersianDateTime != null) ||
            (!this.isPersian && this.startDateTime != null && this.endDateTime != null))
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
        __metadata("design:type", Object)
    ], MdsDatetimePickerCoreComponent.prototype, "persianChar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerCoreComponent.prototype, "isPersian", void 0);
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
        __metadata("design:type", Object)
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