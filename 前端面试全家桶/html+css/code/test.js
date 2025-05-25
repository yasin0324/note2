// const data = { msg: "yasin" };
// const copyData = { ...data };

// Object.defineProperty(data, "msg", {
//     get() {
//         return copyData.msg;
//     },

//     set(newValue) {
//         oInput.value = newValue;
//         oDiv.innerText = newValue;
//         copyData.msg = newValue;
//     },
// });

// const oInput = document.querySelector("input");
// const oDiv = document.querySelector("div");
// oInput.addEventListener("input", function (e) {
//     data.msg = e.target.input;
// });

// const data = { msg: "yasin", a: "", b: "" };

// Object.keys(data).forEach((key) => {
//     reactive(data, key, data[key]);
// });

// function reactive(data, key, v) {
//     Object.defineProperty(data, key, {
//         get() {
//             return v;
//         },
//         set(newValue) {
//             oInput.value = newValue;
//             oDiv.innerText = newValue;
//             v = newValue;
//         },
//     });
// }

// const oInput = document.querySelector("input");
// const oDiv = document.querySelector("div");
// oInput.addEventListener("input", function (e) {
//     data.b = e.target.value;
// });

// const data = { msg: "yasin", a: "", b: "" };

// const p = new Proxy(data, {
//     get(target, prop) {
//         return target[prop];
//     },
//     set(target, prop, newValue) {
//         oInput.value = newValue;
//         oDiv.innerText = newValue;
//         target[prop] = newValue;
//     },
// });

// const oInput = document.querySelector("input");
// const oDiv = document.querySelector("div");
// oInput.addEventListener("input", function (e) {
//     p.msg = e.target.value;
// });

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Object.prototype.say = function () {
  console.log(3);
};
const p1 = new Person("ifer", 18);

console.log(p1.__proto__ === Person.prototype);
console.log(Person.prototype.__proto__ === Object.prototype);
console.log(Object.prototype.__proto__ === null);
console.log(p1.__proto__.__proto__ === Object.prototype);