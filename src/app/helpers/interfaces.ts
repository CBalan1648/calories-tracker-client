export interface MealsStats {
    totalMeals: number;
    totalCalories: number;
    averageCalories: string;

    mealsAboveTarget: number;
    mealsBelowTarget: number;

    mostCaloricMealTitle: string;
    mostCaloricMealCalories: number;

    leastCaloricMealTitle: string;
    leastCaloricMealCalories: number;
}

export interface MatDialogConfiguration {
    width: string;
    height: string;
    panelClass: string;
    data: any;
}
