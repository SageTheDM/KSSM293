class Car {
    constructor(make, speed) {
        this.make = make;
        this.speed = speed;
    }

    accelerate() {
        this.speed += 10;
        console.log(`${this.make} is going at ${this.speed} km/h`);
    }

    brake() {
        this.speed -= 5;
        console.log(`${this.make} is going at ${this.speed} km/h`);
    }
}

const car1 = new Car('Toyota', 120);
const car2 = new Car('Subaru', 95);

// random testing
car1.accelerate();
car1.accelerate();
car1.accelerate();
car1.accelerate();
car1.accelerate();
car1.accelerate();
car1.accelerate();
car1.brake();

car2.accelerate();
car2.brake();
car2.accelerate();
car2.brake();
car2.accelerate();
car2.brake();
car2.accelerate();
car2.brake();
car2.accelerate();
car2.brake();
car2.accelerate();
car2.brake();
