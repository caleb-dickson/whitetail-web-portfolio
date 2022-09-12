import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubResponseData } from './GithubResponseData.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  lastUpdated: Date;
  darkModeOn: false; // COMING SOON!

  constructor(private http: HttpClient) {}

  getLastUpdate() {
    this.lastUpdated = new Date();
    this.lastUpdated.setDate(this.lastUpdated.getDate() - 9);
    return this.lastUpdated;
  }

  getGithubData(): Observable<GithubResponseData> {
    return this.http.get<any>('https://api.github.com/users/tacDev-io')
  }

}
