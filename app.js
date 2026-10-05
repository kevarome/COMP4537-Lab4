const MathOperations = require('./modules/math');

class App {
    constructor() {
        this.math = new MathOperations();
    }

    run() {
        const sum = this.math.add(10, 5);
        const difference = this.math.subtract(10, 5);

        console.log(`Hello Kevin. 10 + 5 = ${sum}`);
        console.log(`Hello Kevin. 10 - 5 = ${difference}`);
    }
}

const app = new App();
app.run();