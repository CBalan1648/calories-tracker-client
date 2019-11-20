import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { retry, take, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MealsService {



  constructor(private http: HttpClient) { }

  public getMeals() {
    return this.http.get('http://localhost:3000/meals').pipe(retry(3),tap(console.log), take(1), map(responseData => responseData.meals))
  }
}


