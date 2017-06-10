export interface IDay {
  year: number,
  month: number;
  day: number;
  dayString: string;
  disable: boolean;
  holiday: boolean; // تعطیل
  today: boolean; // آیا تاریخ برابر با امروز است
  isWithinRange: boolean; // آیا در محدوده رنج انتخاب شده می باشد
  isStartOrEndOfRange: boolean; // آیا برابر با تاریخ شروع یا پایان می باشد
}