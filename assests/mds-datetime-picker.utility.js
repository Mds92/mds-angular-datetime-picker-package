"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mds_persian_datetime_1 = require("mds.persian.datetime");
var PersianDateTime = mds_persian_datetime_1.Mds.PersianDateTime;
var MdsDatetimePickerUtility = (function () {
    function MdsDatetimePickerUtility() {
    }
    MdsDatetimePickerUtility.toPersianNumber = function (input) {
        if (input == '' || input == null)
            return '';
        input = input.replace(/ي/img, 'ی').replace(/ك/img, 'ک');
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
    };
    MdsDatetimePickerUtility.toEnglishNumber = function (input) {
        if (input == '' || input == null)
            return 0;
        input = input.replace(/ي/img, 'ی').replace(/ك/img, 'ک');
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
    };
    MdsDatetimePickerUtility.toEnglishString = function (input) {
        if (input == '' || input == null)
            return '';
        input = input.replace(/ي/img, 'ی').replace(/ك/img, 'ک');
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
    };
    MdsDatetimePickerUtility.dateTimeToString = function (date, format) {
        if (format === void 0) { format = ''; }
        if (format == '' || format == null)
            return this.zeroPad(date.getFullYear(), '0000') + "/" + this.zeroPad(date.getMonth() + 1, '00') + "/" + this.zeroPad(date.getDate(), '00') + "   " + this.zeroPad(date.getHours(), '00') + ":" + this.zeroPad(date.getMinutes(), '00') + ":" + this.zeroPad(date.getSeconds(), '00');
        var dateTimeString = format;
        dateTimeString = dateTimeString.replace(/yyyy/, this.zeroPad(date.getFullYear(), '0000'));
        dateTimeString = dateTimeString.replace(/yy/, this.zeroPad(date.getFullYear(), '00'));
        dateTimeString = dateTimeString.replace(/dddd/, this.getGregorianWeekDayName(date.getDay()));
        dateTimeString = dateTimeString.replace(/dd/, this.zeroPad(date.getDate(), '00'));
        dateTimeString = dateTimeString.replace(/d/, date.getDate().toString());
        dateTimeString = dateTimeString.replace(/hh/, this.zeroPad(date.getHours(), '00'));
        dateTimeString = dateTimeString.replace(/h/, date.getHours().toString());
        dateTimeString = dateTimeString.replace(/mm/, this.zeroPad(date.getMinutes(), '00'));
        dateTimeString = dateTimeString.replace(/m/, date.getMinutes().toString());
        dateTimeString = dateTimeString.replace(/ss/, this.zeroPad(date.getSeconds(), '00'));
        dateTimeString = dateTimeString.replace(/s/, date.getSeconds().toString());
        dateTimeString = dateTimeString.replace(/fff/, this.zeroPad(date.getMilliseconds(), '000'));
        dateTimeString = dateTimeString.replace(/ff/, this.zeroPad(date.getMilliseconds() / 10, '00'));
        dateTimeString = dateTimeString.replace(/f/, (date.getMilliseconds() / 10).toString());
        dateTimeString = dateTimeString.replace(/MMMM/, this.getGregorianMonthName(date.getMonth()));
        dateTimeString = dateTimeString.replace(/MM/, this.zeroPad(date.getMonth() + 1, '00'));
        dateTimeString = dateTimeString.replace(/M(?!a)/, (date.getMonth() + 1).toString());
        return dateTimeString;
    };
    MdsDatetimePickerUtility.zeroPad = function (nr, base) {
        if (nr == undefined || nr == '')
            return base;
        var len = (String(base).length - String(nr).length) + 1;
        return len > 0 ? new Array(len).join('0') + nr : nr;
    };
    MdsDatetimePickerUtility.getGregorianMonthName = function (monthIndex) {
        return [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ][monthIndex];
    };
    MdsDatetimePickerUtility.getGregorianWeekDayName = function (weekDayIndex) {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekDayIndex];
    };
    MdsDatetimePickerUtility.getPersianDateRanges = function (dateRangeString) {
        var startEndDateArrayResult = new Array();
        try {
            var startEndDateArray = dateRangeString.split(' - ');
            var startMdsPersianDateTime = PersianDateTime.parse(startEndDateArray[0]);
            var endMdsPersianDateTime = PersianDateTime.parse(startEndDateArray[1]);
            if (endMdsPersianDateTime.toDate() < startMdsPersianDateTime.toDate())
                throw new Error('Range date is not valid. End date must be bigger than start date');
            startEndDateArrayResult.push(startMdsPersianDateTime);
            startEndDateArrayResult.push(endMdsPersianDateTime);
        }
        catch (e) {
            throw new Error('Range date is not valid. You must enter range date string like "1396/03/06 - 1396/03/21"');
        }
        return startEndDateArrayResult;
    };
    MdsDatetimePickerUtility.getDateRanges = function (dateRangeString) {
        var startEndDateArrayResult = new Array();
        try {
            var startEndDateArray = dateRangeString.split(' - ');
            var startDateTime = new Date(Date.parse(startEndDateArray[0]));
            var endDateTime = new Date(Date.parse(startEndDateArray[1]));
            if (endDateTime < startDateTime)
                throw new Error('Range date is not valid. End date must be bigger than start date');
            startEndDateArrayResult.push(startDateTime);
            startEndDateArrayResult.push(endDateTime);
        }
        catch (e) {
            throw new Error('Range date is not valid. You must enter range date string like "2017/02/06 - 2017/02/18"');
        }
        return startEndDateArrayResult;
    };
    return MdsDatetimePickerUtility;
}());
exports.MdsDatetimePickerUtility = MdsDatetimePickerUtility;
//# sourceMappingURL=mds-datetime-picker.utility.js.map