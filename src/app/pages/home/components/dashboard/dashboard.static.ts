export const getLastXDaysCalories = (days : number, daysMap: Map<string, number>) => {

    const date = new Date();
    const caloriesByDay = [];

    for (let x = 0; x < days; x++) {
        const time = date.getTime();
        const day = `${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`;
        const calories = daysMap.get(day) || 0;


        caloriesByDay.push([calories, time, day]);
        date.setDate(date.getDate() - 1);
    }
    return caloriesByDay.reverse();
};

export const normalizeDataHeight = (array, height) => {
    const maxValue = Math.max(...array.map(val => val[0]));
    const ajustedMax = maxValue + maxValue / 3;

    return array.map((value) => {
        return Math.floor(height / ajustedMax * value[0]);
    });
};

export const reverseDataHeight = (array, height) => {
    return array.map(value => height - value - 10);
};

export const addNormalizedDataWidth = (array, width) => {
    return array.map((value, index) => {
        return [Math.floor((width / (array.length - 1) * index)), value];
    });
};

const line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    };
};

const controlPoint = (current, previous, next, reverse) => {
    const previousPoint = previous || current;
    const nextPoint = next || current;
    const smoothing = 0.1;
    const opposedLine = line(previousPoint, nextPoint);
    const angle = opposedLine.angle + (reverse ? Math.PI : 0);
    const length = opposedLine.length * smoothing;

    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
};

const bezierCommand = (point, i, a) => {
    const [startControlPointX, startControlPointY] = controlPoint(a[i - 1], a[i - 2], point, false);
    const [endControlPointX, endControlPointY] = controlPoint(point, a[i - 1], a[i + 1], true);

    return `C ${startControlPointX},${startControlPointY} ` +
        `${endControlPointX},${endControlPointY} ` +
        `${point[0]},${point[1]} `;
};

export const createSvgPath = (array) => {
    let svgPath = `M -30 0 , -30 ${300} ,${array[0][0]}, ${array[0][1]} `;
    array.forEach((value, index, currentArray) => {
        if (index === 0) { return; }
        svgPath += bezierCommand(value, index, currentArray);
    });
    return svgPath;
};
