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
var mds_datetime_picker_utility_1 = require("../assests/mds-datetime-picker.utility");
var mds_datetime_picker_core_component_1 = require("./core/mds-datetime-picker-core.component");
var enums_1 = require("../assests/enums");
var MdsDatetimePickerComponent = (function () {
    function MdsDatetimePickerComponent(element) {
        var _this = this;
        this.element = element;
        this.templateType = enums_1.TemplateTypeEnum.bootstrap;
        this.textBoxType = enums_1.TextBoxTypeEnum.withButton;
        this.initialValue = '';
        this.inLine = true;
        this.persianChar = true;
        this.rangeSelector = false;
        this.isPersian = true;
        this.timePicker = true;
        this.placeHolder = '';
        this.buttonIcon = '📅';
        this.format = '';
        this.dateChanged = new core_1.EventEmitter();
        this.rangeDateChanged = new core_1.EventEmitter();
        this.textBoxKeyDown = new core_1.EventEmitter();
        this.textBoxBlur = new core_1.EventEmitter();
        this.textBoxFocus = new core_1.EventEmitter();
        this.textBoxChange = new core_1.EventEmitter();
        this.textboxValue = '';
        this.topOffset = 0;
        this.leftOffset = 0;
        this.afterViewInit = false;
        this.inClearFunction = false;
        this.showingDateTimePickerLocked = false;
        this.showDatePicker = false;
        this._selectedDateTime = null;
        this._selectedDateTimeRanges = null;
        var doc = document.getElementsByTagName('html')[0];
        doc.addEventListener('click', function (event) {
            var targetElement = event.target;
            if (_this.showDatePicker && event.target &&
                _this.element.nativeElement !== event.target &&
                !_this.element.nativeElement.contains(event.target) &&
                !targetElement.hasAttribute('data-mds-persian-datetimepicker')) {
                _this.showDatePicker = false;
                _this.mdsDateTimePickerCore.hideSelecMonthAndYearBlock();
                _this.mdsDateTimePickerCore.resetIncompleteRanges();
            }
        }, false);
    }
    MdsDatetimePickerComponent.prototype.ngOnInit = function () {
        this.initialValue = !this.persianChar ? mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toEnglishString(this.initialValue) : mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this.initialValue);
        if (this.initialValue != '' && this.rangeSelector) {
            if (this.isPersian)
                mds_datetime_picker_utility_1.MdsDatetimePickerUtility.getPersianDateRanges(this.initialValue);
            else
                mds_datetime_picker_utility_1.MdsDatetimePickerUtility.getDateRanges(this.initialValue);
            this.textboxValue = this.initialValue;
        }
        else
            this.textboxValue = this.initialValue;
        if (!this.isPersian)
            this.persianChar = false;
    };
    MdsDatetimePickerComponent.prototype.ngAfterViewInit = function () {
        this.afterViewInit = true;
    };
    Object.defineProperty(MdsDatetimePickerComponent.prototype, "selectedDateTime", {
        get: function () {
            return this._selectedDateTime;
        },
        set: function (value) {
            try {
                this.mdsDateTimePickerCore.setDateTimeByDate(value == null ? null : new Date(value));
                if (value == null)
                    this._selectedDateTime = null;
                else
                    this._selectedDateTime = new Date(value);
            }
            catch (e) {
                this.clear();
                console.error(e);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdsDatetimePickerComponent.prototype, "selectedDateTimeRanges", {
        get: function () {
            return this._selectedDateTimeRanges;
        },
        set: function (values) {
            try {
                if (values == null || values.length < 2)
                    return;
                this.mdsDateTimePickerCore.setDateTimeRangesByDate(values[0] == null ? null : new Date(values[0]), values[1] == null ? null : new Date(values[1]));
                this._selectedDateTimeRanges = [values[0], values[1]];
            }
            catch (e) {
                this.clear();
                console.error(e);
            }
        },
        enumerable: true,
        configurable: true
    });
    MdsDatetimePickerComponent.prototype.getEventObject = function (event) {
        return {
            event: event,
            selectedDate: this.mdsDateTimePickerCore.getSelectedDate,
            selectedRangeDates: this.mdsDateTimePickerCore.getSelectedRangeDates
        };
    };
    MdsDatetimePickerComponent.prototype.showDatePickerButtonClicked = function () {
        this.showDatePicker = !this.showDatePicker;
        if (this.showDatePicker) {
            var rectObject = this.element.nativeElement.getBoundingClientRect();
            this.topOffset = rectObject.top;
            this.leftOffset = rectObject.left;
        }
    };
    MdsDatetimePickerComponent.prototype.dateChangedHandler = function (date) {
        if (!this.afterViewInit)
            return;
        this.dateChanged.emit(date);
        if (date != null) {
            this.textboxValue = date.formatString;
            this.selectedDateTime = new Date(date.utcDateTime);
            if (!this.showingDateTimePickerLocked)
                this.showDatePicker = false;
        }
    };
    MdsDatetimePickerComponent.prototype.rangeDateChangedHandler = function (rangeDate) {
        if (!this.afterViewInit)
            return;
        this.textboxValue = '';
        if (rangeDate == null) {
            this.rangeDateChanged.emit(rangeDate);
            this.selectedDateTimeRanges = [null, null];
            return;
        }
        if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '')
            this.textboxValue = rangeDate.startDate.formatString + " - " + rangeDate.endDate.formatString;
        this.rangeDateChanged.emit(rangeDate);
        if (rangeDate.startDate.formatString != '' && rangeDate.endDate.formatString != '' && !this.showingDateTimePickerLocked)
            this.showDatePicker = false;
        this.selectedDateTimeRanges = [rangeDate.startDate.utcDateTime, rangeDate.endDate.utcDateTime];
    };
    MdsDatetimePickerComponent.prototype.dateTimeTextBoxOnFocusHandler = function (event) {
        document.getElementsByTagName('html')[0].click();
        try {
            if (this.selectedDateTime != null)
                this.mdsDateTimePickerCore.setDateTimeByDate(this.selectedDateTime);
        }
        catch (e) {
            this.clear();
            console.error(e);
        }
        this.showDatePickerButtonClicked();
        this.textBoxFocus.emit(this.getEventObject(event));
    };
    MdsDatetimePickerComponent.prototype.dateTimeTextBoxOnBlurHandler = function (event) {
        this.textboxValue = this.textboxValue.trim();
        if (this.persianChar)
            this.textboxValue = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toPersianNumber(this.textboxValue);
        else
            this.textboxValue = mds_datetime_picker_utility_1.MdsDatetimePickerUtility.toEnglishString(this.textboxValue);
        var targetElement = event.target;
        if (!targetElement.hasAttribute('data-mds-persian-datetimepicker')) {
            this.showingDateTimePickerLocked = true;
            this.mdsDateTimePickerCore.setDateTimeByString(this.textboxValue);
            this.showingDateTimePickerLocked = false;
        }
        this.textBoxBlur.emit(this.getEventObject(event));
    };
    MdsDatetimePickerComponent.prototype.dateTimeTextBoxOnKeyDownHandler = function (event) {
        if (event.keyCode != 13) {
            this.textBoxKeyDown.emit(this.getEventObject(event));
            return;
        }
        var value = event.target.value.trim();
        if (value == '')
            this.mdsDateTimePickerCore.clearDateTimePicker();
        else
            this.mdsDateTimePickerCore.setDateTimeByString(this.textboxValue);
        this.showDatePicker = false;
        this.textBoxKeyDown.emit(this.getEventObject(event));
    };
    MdsDatetimePickerComponent.prototype.clear = function () {
        if (this.inClearFunction)
            return;
        this.inClearFunction = true;
        this.textboxValue = '';
        this.selectedDateTime = null;
        this.selectedDateTimeRanges = [null, null];
        this.mdsDateTimePickerCore.clearDateTimePicker();
        this.inClearFunction = false;
    };
    MdsDatetimePickerComponent.prototype.setDateTime = function (dateTime) {
        try {
            this.mdsDateTimePickerCore.setDateTimeByDate(dateTime);
        }
        catch (e) {
            this.clear();
            console.error(e);
        }
    };
    MdsDatetimePickerComponent.prototype.setDateTimeRanges = function (startDateTime, endDateTime) {
        try {
            this.mdsDateTimePickerCore.setDateTimeRangesByDate(startDateTime, endDateTime);
        }
        catch (e) {
            this.clear();
            console.error(e);
        }
    };
    MdsDatetimePickerComponent.prototype.showDateTimePicker = function () {
        this.showDatePicker = true;
    };
    MdsDatetimePickerComponent.prototype.hideDateTimePicker = function () {
        this.showDatePicker = false;
    };
    __decorate([
        core_1.ViewChild('mdsDateTimePickerCore'),
        __metadata("design:type", mds_datetime_picker_core_component_1.MdsDatetimePickerCoreComponent)
    ], MdsDatetimePickerComponent.prototype, "mdsDateTimePickerCore", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MdsDatetimePickerComponent.prototype, "templateType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], MdsDatetimePickerComponent.prototype, "textBoxType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "initialValue", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "inLine", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "persianChar", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "rangeSelector", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "isPersian", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "timePicker", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "placeHolder", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "buttonIcon", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "format", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "dateChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "rangeDateChanged", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "textBoxKeyDown", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "textBoxBlur", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "textBoxFocus", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MdsDatetimePickerComponent.prototype, "textBoxChange", void 0);
    MdsDatetimePickerComponent = __decorate([
        core_1.Component({
            selector: 'mds-datetime-picker',
            templateUrl: './mds-datetime-picker.component.html',
            styleUrls: ['./mds-datetime-picker.component.css']
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], MdsDatetimePickerComponent);
    return MdsDatetimePickerComponent;
}());
exports.MdsDatetimePickerComponent = MdsDatetimePickerComponent;
//# sourceMappingURL=mds-datetime-picker.component.js.map