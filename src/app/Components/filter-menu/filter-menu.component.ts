import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css']
})
export class FilterMenuComponent implements OnInit {

  constructor(private readonly formBuilder : FormBuilder) { }

  filterForm = this.formBuilder.group({
    stringSearch: [''],
    timeSpan: [''],
    customDateFrom: [''],
    customDateTo: [''],
    repeatPassword: ['']
  });


  ngOnInit() {
  }

}
