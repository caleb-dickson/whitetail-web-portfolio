import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  lastUpdated: Date;
  darkModeOn: false; // COMING SOON!

  constructor() {}

  getLastUpdate() {
    this.lastUpdated = new Date();
    this.lastUpdated.setDate(this.lastUpdated.getDate() - 9);
    return this.lastUpdated;
  }
}
