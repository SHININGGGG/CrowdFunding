import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';

@Component({
  selector: 'app-log-management',
  templateUrl: './log-management.component.html',
  styleUrls: ['./log-management.component.scss']
})
export class LogManagementComponent implements OnInit {

  logs: any

  constructor(private logService: LogService) {

  }

  async ngOnInit() {
    this.logs = await this.logService.fetchLogs();
    console.log(this.logs);
  }
}
