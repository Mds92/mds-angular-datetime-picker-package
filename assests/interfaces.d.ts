export interface IDay {
    year: number;
    month: number;
    day: number;
    dayString: string;
    disable: boolean;
    holiday: boolean;
    today: boolean;
    isWithinRange: boolean;
    isStartOrEndOfRange: boolean;
}
export interface IDate {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    formatString: string;
    utcDateTime: Date;
}
export interface IRangeDate {
    startDate: IDate;
    endDate: IDate;
}
export interface IEventModel {
    event: any;
    selectedDate: IDate;
    selectedRangeDates: IRangeDate;
}
