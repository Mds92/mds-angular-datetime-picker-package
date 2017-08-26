import { Mds } from 'mds.persian.datetime';
import PersianDateTime = Mds.PersianDateTime;
export declare class MdsDatetimePickerUtility {
    static toPersianNumber(input: string): string;
    static toEnglishNumber(input: string): number;
    static toEnglishString(input: string): string;
    static dateTimeToString(date: Date, format?: string): string;
    static zeroPad(nr: any, base: string): string;
    static getGregorianMonthName(monthIndex: number): string;
    static getGregorianWeekDayName(weekDayIndex: number): string;
    static getPersianDateRanges(dateRangeString: string): PersianDateTime[];
    static getDateRanges(dateRangeString: string): Date[];
}
