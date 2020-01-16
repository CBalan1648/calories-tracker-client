import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { addNormalizedDataWidth, createSvgPath, normalizeDataHeight, reverseDataHeight } from '../dashboard/dashboard.static';

const DEFAULT_GRAPH_WIDTH = 1000;
const DEFAULT_GRAPH_HEIGHT = 300;
const GRADIENT_CHANGE_ZONE = 40;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {

  @Input() userTargetCalories: number;
  @Input() caloriesByDayObservable: Observable<number[]>;
  @Input() targetCaloriesValueObservable: Observable<number>;
  @Input() setSliderMaxValue: (maxValue: number) => void;
  @Input() setSliderValue: (value: number) => void;

  @ViewChild('svgElementIdentifier', { static: false })
  private svgElementIdentifier: ElementRef;

  private width = DEFAULT_GRAPH_WIDTH;
  private height = DEFAULT_GRAPH_HEIGHT;

  private redGradientPart: string;
  private greenGradientPart: string;
  private svgPath: string;
  private svgPathCalories: string;
  private normalizedPositions: Array<Array<number>>;

  private caloriesByDay: number[];

  constructor() {
  }

  ngOnInit() {
    this.caloriesByDayObservable.subscribe(caloriesByDay => {
      this.caloriesByDay = caloriesByDay;
      this.calculateSvgGraph();

    });

    this.targetCaloriesValueObservable.subscribe(newCaloriesValue => {
      this.userTargetCalories = newCaloriesValue;
      this.calculateSvgPathCalories();
    });
  }

  ngAfterViewInit() {
    this.width = this.svgElementIdentifier.nativeElement.clientWidth;
  }

  @HostListener('window:resize')
  onResize() {
    this.width = this.svgElementIdentifier.nativeElement.clientWidth;
    this.calculateSvgGraph();
  }

  calculateSvgGraph() {
    this.calculateSvgPath();
    this.calculateSvgPathCalories();
  }

  calculateSvgPath() {
    const normalizedData = reverseDataHeight(normalizeDataHeight(this.caloriesByDay, this.height), this.height);
    const normalizedPositions = (addNormalizedDataWidth(normalizedData, this.width));
    this.normalizedPositions = normalizedPositions;
    this.svgPath = createSvgPath(normalizedPositions);
  }

  calculateSvgPathCalories() {
    const maxCalories = Math.max(...this.caloriesByDay.map(caloriesData => caloriesData[0]));
    const normalizedCaloriesHeight = Math.floor(this.height / (maxCalories + maxCalories / 3) * this.userTargetCalories);
    const reversedCaloriesHeight = this.height - normalizedCaloriesHeight;

    this.setSliderMaxValue(Math.floor(maxCalories + maxCalories / 3));
    this.setSliderValue(this.userTargetCalories);

    const redGradientPart = Math.floor(reversedCaloriesHeight * 100 / this.height);

    this.redGradientPart = `${redGradientPart - GRADIENT_CHANGE_ZONE}%`;
    this.greenGradientPart = `${redGradientPart + GRADIENT_CHANGE_ZONE}%`;

    this.svgPathCalories = `M 0 ${reversedCaloriesHeight}, ${this.width}, ${reversedCaloriesHeight}`;
  }
}
