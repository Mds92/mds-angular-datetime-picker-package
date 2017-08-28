# Mds Angular Persian and Gregorian DateTimePicker
Persian and gregorian DateTimePicker with angular 4 and angular materials

Installing package via npm:
```
npm install mds.angular.datetimepicker --save
```

[Demo](https://mds92.github.io/MdsDateTimePickerSample/dist/)

------------------------------------------

![Mds Angular Persian and Gregorian DateTimePicker](https://raw.githubusercontent.com/Mds92/Mds92.github.io/master/MdsDateTimePickerSample/images/Angular-Persian-Date-Time-Picker-1.jpg)

![Mds Angular Persian and Gregorian DateTimePicker](https://raw.githubusercontent.com/Mds92/Mds92.github.io/master/MdsDateTimePickerSample/images/Angular-Persian-Date-Time-Picker-2.jpg)

------------------------------------------
## How To Use:
1. First add `import` to your module,
```javascript
import { MdsDatetimePickerModule } from 'mds.angular.datetimepicker';
```
2. Add to `imports` section of your @NgModule, sample:
```javascript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MdsDatetimePickerModule],
  providers: [], 
  bootstrap: [AppComponent]
})
export class AppModule { }
```
