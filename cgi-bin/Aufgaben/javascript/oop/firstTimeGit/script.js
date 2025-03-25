'use strict';

// old version of oop in javascript
const Person = function (firstname, birthday) {
    this.firstname = firstname;
    this.birthday = birthday;
}

Person.prototype.calcAge = function () {
    console.log(2031 - this.birthday);
}

const christian = new person("Chirstian", 1985);
const anna = new Person("Anna", 2005);
const katja = new Person("Katja", 2005);

console.log(christian, katja, anna);
console.log(christian instanceof Person);
christian.calcAge;

// new oop in javascript
class PersonCl {
    constructor(firstname, birthday) {
        this.firstname = firstname;
        this.birthday = birthday;
    }

    calcage() {
        console.log(2031 - this.birthday);
    }
}

const jessica = new Person("Jessica", 2001);
console.log(jessica); // simulates the old version
jessica.calcAge;