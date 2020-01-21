import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addNormalizedDataWidth,
  calculateGradient, createSvgPath,
  getMaxCalories, getSvgLinePath,
  normalizeDataHeight, reverseDataHeight
} from '../dashboard/dashboard.static';

const DEFAULT_GRAPH_WIDTH = 1000;
const DEFAULT_GRAPH_HEIGHT = 300;


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

  constructor() { }

  ngOnInit() {
    this.caloriesByDayObservable.subscribe(caloriesByDay => {
      this.caloriesByDay = caloriesByDay;
      this.calculateSvgGraph();

    });

    this.targetCaloriesValueObservable.subscribe(newCaloriesValue => {
      this.userTargetCalories = newCaloriesValue;
      this.calculateSvgTargetCaloriesLinePath();
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
    this.calculateSvgTargetCaloriesLinePath();
  }

  calculateSvgPath() {
    const normalizedData = reverseDataHeight(normalizeDataHeight(this.caloriesByDay, this.height), this.height);
    this.normalizedPositions = addNormalizedDataWidth(normalizedData, this.width);
    this.svgPath = createSvgPath(this.normalizedPositions);
  }

  calculateSvgTargetCaloriesLinePath() {
    const maxCalories = getMaxCalories(this.caloriesByDay);
    const normalizedLineHeight = Math.floor(this.height / (maxCalories + maxCalories / 3) * this.userTargetCalories);
    const reverserdLineHeight = this.height - normalizedLineHeight;

    this.setSliderMaxValue(Math.floor(maxCalories + maxCalories / 3));
    this.setSliderValue(this.userTargetCalories);

    this.calculateSvgGradients(reverserdLineHeight);
    this.svgPathCalories = getSvgLinePath(reverserdLineHeight, this.height);
  }

  calculateSvgGradients(reversedCaloriesHeight) {
    const gradients = calculateGradient(reversedCaloriesHeight, this.height);
    this.redGradientPart = gradients.redGradientPart;
    this.greenGradientPart = gradients.greenGradientPart;
  }
}

