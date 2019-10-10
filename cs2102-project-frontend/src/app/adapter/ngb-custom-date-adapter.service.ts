import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

// NOT WORKING
export class NgbCustomDateAdapterService implements NgbDateAdapter<any> {

  fromModel(timestamp: any) {

    if(!timestamp) {
      return null;
    }
    // console.log(momentDate);
    // let duration = moment.duration(momentDate.diff(moment().startOf('day'))).asDays();
    // return this.calendar.getNext(this.calendar.getToday(), 'd', duration);
    console.log(timestamp);
    if(typeof(timestamp) == "string")
      timestamp = Number.parseInt(timestamp);

      let targetDate = new Date(timestamp);
      let targetDateStruct: NgbDateStruct = {
        day: targetDate.getDay(),
        month: targetDate.getMonth(),
        year: targetDate.getFullYear()
      }

      return targetDateStruct;
  }

  toModel(date: NgbDateStruct) {
    let day = date.day;
    let month = date.month;
    let year = date.year;

    let resultDate = moment();
    resultDate.set('day', day);
    resultDate.set('month', month);
    resultDate.set('year', year);
    resultDate.startOf('day');

    console.log(resultDate.valueOf())
    return resultDate.valueOf();
  }
}
