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
