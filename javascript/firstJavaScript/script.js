// Explanation of == vs === and semicolon usage

// Loose equality (==) compares values for equality after converting them to a common type
let a = '5'
var b = 5 // var not recommended
console.log(a + " " + b)

console.log(5 == "5") // true, because '5' is converted to 5 for comparison

// Strict equality (===) compares both value and type without type conversion
console.log(5 === "5") // false => '5' (string) is not the same type as 5 (number)

// Semicolons are optional
console.log("Hello, World!")
console.log("Hello, World!");

let javaIsFun = true
let age = 19
let float = 56876545.333

console.log(javaIsFun)
console.log(age)
console.log(float)

console.log(typeof javaIsFun)
console.log(typeof age)
console.log(typeof float)

javaIsFun = "yaaas"
age = true
float = true

console.log(typeof javaIsFun)
console.log(typeof age)
console.log(typeof float)

const myConst = 2000
console.log(myConst)

