"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MdsDatetimePickerResourcesService = (function () {
    function MdsDatetimePickerResourcesService() {
        this.persianResources = {
            'Year': 'سال',
            'Month': 'ماه',
            'Day': 'روز',
            'PreviousYear': 'سال قبل',
            'PreviousMonth': 'ماه قبل',
            'NextYear': 'سال بعد',
            'NextMonth': 'ماه بعد',
            'SelectMonth': 'انتخاب ماه',
            'Today': 'امروز',
            'Confirm': 'تایید',
            'Reject': 'رد',
            'Start': 'شروع',
            'End': 'پایان'
        };
        this.englishResources = {
            'Year': 'Year',
            'Month': 'Month',
            'Day': 'Day',
            'PreviousYear': 'Previous Year',
            'PreviousMonth': 'Previous Month',
            'NextYear': 'Next Year',
            'NextMonth': 'Next Month',
            'SelectMonth': 'Select Month',
            'Today': 'Today',
            'Confirm': 'Confirm',
            'Reject': 'Reject',
            'Start': 'Start',
            'End': 'End'
        };
    }
    MdsDatetimePickerResourcesService = __decorate([
        core_1.Injectable()
    ], MdsDatetimePickerResourcesService);
    return MdsDatetimePickerResourcesService;
}());
exports.MdsDatetimePickerResourcesService = MdsDatetimePickerResourcesService;
//# sourceMappingURL=mds-datetime-picker-resources.service.js.map