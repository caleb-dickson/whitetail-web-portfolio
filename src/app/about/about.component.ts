import { Component } from '@angular/core';
import { Sweep_FadeFromLeft, Sweep_FadeFromRight } from '../app.animations';

class Article {
  constructor(public name: string, public expanded: boolean) {
    this.name = name;
    this.expanded = expanded;
  }
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [Sweep_FadeFromRight, Sweep_FadeFromLeft]
})
export class AboutComponent {
  why = new Article('why', false);
  beginnings = new Article('experience', false);
  journey = new Article('journey', false);

  articlesList: Article[] = [this.why, this.journey, this.beginnings];

  toggleArticleExpand(article) {
    article.expanded = !article.expanded;
  }

  expandAll() {
    this.articlesList.map((article: Article) => {
      article.expanded = true;
    });
  }

  collapseAll() {
    this.articlesList.map((article: Article) => {
      article.expanded = false;
    });
  }
}
