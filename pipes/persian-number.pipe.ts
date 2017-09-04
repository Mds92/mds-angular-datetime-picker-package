import { Pipe, PipeTransform } from '@angular/core';
import { MdsDatetimePickerUtility } from "../index";

@Pipe({ name: 'persianNumber' })
export class PersianNumberPipe implements PipeTransform {
  transform(value: string, isPersian: boolean): string {
    if (!isPersian) return value;
    return MdsDatetimePickerUtility.toPersianNumber(value);
  }
}