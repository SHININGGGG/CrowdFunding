import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  async fetchLogs(entityType?) {
    let logs =  await this.http.get(`${environment.ENDPOINT}/api/log`).toPromise();
    return logs;
  }
}
