import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filterFormConfig } from 'src/app/Helpers/objects.static';
import { MealsService } from 'src/app/Services/meals.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  private filterSubscription: Subscription;

  constructor(private readonly formBuilder: FormBuilder, private readonly mealService: MealsService) { }

  filterForm = this.formBuilder.group(filterFormConfig);

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
