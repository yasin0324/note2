function Person(name) {
    this.name = name;
}
// // 修改原型
// Person.prototype.getName = function() {}
// var p = new Person('hello')
// console.log(p.__proto__ === Person.prototype) // true
// console.log(p.__proto__ === p.constructor.prototype) // true
// // 重写原型
// Person.prototype = {
//     getName: function() {}
// }
// var p = new Person('hello')
// console.log(p.__proto__ === Person.prototype)        // true
// console.log(p.__proto__ === p.constructor.prototype) // false

Person.prototype = {
    getName: function () {},
};
var p = new Person("hello");
// p.constructor = Person;
// console.log(
//     Object.getOwnPropertyDescriptors(Person.prototype.constructor.prototype)
// );
// console.log(Object.getOwnPropertyDescriptors(Person.prototype));
// console.log(Object.getOwnPropertyDescriptors(Object.prototype));
console.log(Person.prototype.constructor === Object.prototype.constructor);
