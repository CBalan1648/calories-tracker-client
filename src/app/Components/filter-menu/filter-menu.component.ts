import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MealsService } from 'src/app/Services/meals.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css']
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  private filterForm;
  private filterSubscription: Subscription;

  constructor(private readonly formBuilder: FormBuilder, private readonly mealService: MealsService) {

    this.filterForm = this.formBuilder.group({
      stringSearch: [''],
      timeSpan: [''],
      customDateFrom: [''],
      customDateTo: [''],
      timeFrame: [''],
      frameBegin: [''],
      frameEnd: [''],
    });
  }

  ngOnInit() {
    this.filterSubscription = this.mealService.connectFilterObservable(this.filterForm.valueChanges);
  }

  ngOnDestroy() {
    this.mealService.disconnectFilterObservable(this.filterSubscription);
  }

  clearFilters() {
    this.filterForm.reset();
  }

}
