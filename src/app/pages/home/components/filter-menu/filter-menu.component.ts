import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filterFormConfig } from 'src/app/helpers/objects.static';
import { MealsService } from 'src/app/services/meals.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit, OnDestroy {

  private filterSubscription: Subscription;
  public filterForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, private readonly mealService: MealsService) { }

  ngOnInit() {
    this.filterForm = this.formBuilder.group(filterFormConfig);
    this.filterSubscription = this.mealService.connectFilterObservable(this.filterForm.valueChanges);
  }

  ngOnDestroy() {
    this.mealService.disconnectFilterObservable(this.filterSubscription);
  }

  clearFilters() {
    this.filterForm.reset();
  }
}
