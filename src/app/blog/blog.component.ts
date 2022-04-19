import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  from: Date = new Date;
  to: Date = new Date;

  constructor(private appService: AppService , private location: Location) { }

  ngOnInit(): void {
    this.from = new Date();
    this.from.setDate(this.from.getDate() + 14);
    this.to = new Date();
    this.to.setDate(this.to.getDate() + 21);
  }

  goBack() {
    this.location.back();
  }

}
