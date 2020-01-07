import { Pipe, PipeTransform } from '@angular/core';
const weekDayString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', ];

@Pipe({ name: 'weekday' })
export class WeekDayPipe implements PipeTransform {
    transform(time: number): string {
        return weekDayString[new Date(time).getDay()];
    }
}
