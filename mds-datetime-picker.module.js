"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var animations_1 = require("@angular/platform-browser/animations");
var mds_datetime_picker_component_1 = require("./components/mds-datetime-picker.component");
var mds_datetime_picker_core_component_1 = require("./components/core/mds-datetime-picker-core.component");
var mds_datetime_picker_resources_service_1 = require("./services/mds-datetime-picker-resources.service");
var MdsDatetimePickerModule = (function () {
    function MdsDatetimePickerModule() {
    }
    MdsDatetimePickerModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, animations_1.BrowserAnimationsModule, material_1.MaterialModule, forms_1.FormsModule],
            exports: [mds_datetime_picker_component_1.MdsDatetimePickerComponent, mds_datetime_picker_core_component_1.MdsDatetimePickerCoreComponent],
            declarations: [mds_datetime_picker_component_1.MdsDatetimePickerComponent, mds_datetime_picker_core_component_1.MdsDatetimePickerCoreComponent],
            providers: [mds_datetime_picker_resources_service_1.MdsDatetimePickerResourcesService]
        })
    ], MdsDatetimePickerModule);
    return MdsDatetimePickerModule;
}());
exports.MdsDatetimePickerModule = MdsDatetimePickerModule;
//# sourceMappingURL=mds-datetime-picker.module.js.map