import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class PageNotFoundComponent {

  public pageNotFoundString = 'Page not found :(';

  constructor() { }
}
