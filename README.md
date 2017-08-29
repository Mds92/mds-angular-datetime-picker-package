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

3. Add to view:
```html
<mds-datetime-picker></mds-datetime-picker>
```

------------------------------------------

## Parameter

| Name        | Type           | Values            | Description  |
--------------|----------------|-------------------|--------------|
**initialValue** | string | date time | First value for initializing<br> Example:<br> `1396/06/06` or `1396/05/06  10:20:00` for persian<br> `2017/06/06` or `2017-06-06  10:20` for gregorian 
**isPersian** | boolean | true, [false] | Is date time picker persian or gregorian
**timePicker** | boolean | true, [false] | Is time picker enable

**templateType** | Enumeration | 1, [2] | You can choose how your date time picker generate<br>In materials you have animations<br> 1 = bootstrap <br> 2 = material
**inLine** | boolean | false, [true] | Show date time picker as in line in page
**textBoxType** | Enumeration | 1, [2] | If you choose `[inLine]="false"` it shows a textbox as picker<br>You can choose how should it shows <br> 1 = withButton <br> 2 = withoutButton


