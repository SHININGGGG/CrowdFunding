import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectstatus'
})
export class ProjectstatusPipe implements PipeTransform {

  transform(project: any, args?: any): String {

    let currentDate = new Date().getTime();

    if(project.isbanned) {
      return "BANNED"
    } else if (project.currentamt === project.targetamount) {
      return "FUNDED"
    } else if(currentDate < project.startdate) {
      return "PENDING"
    } else if(currentDate < project.enddate) {
      return "ONGOING"
    }else {
      return "EXPIRED"
    }
  }

}
