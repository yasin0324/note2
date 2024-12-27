// new
// 在调用new的过程中会发生：
// 1.创建一个新的空对象
// 2.将新对象的原型指向构造函数的prototype
// 3.执行构造函数，并且将构造函数的this绑定到新创建的对象上
// 4.返回新对象（如果构造函数没有显式返回对象，默认返回新创建的对象）
function myNew(constructor, ...args) {
    // 1.创建一个空对象，并设置原型指向构造函数的prototype
    const obj = Object.create(constructor.prototype);

    // 2.调用构造函数，并将'this'绑定到新对象上
    const result = constructor.apply(obj, args);

    // 3.如果构造函数返回了一个对象，则返回该对象；否则返回新创建的对象
    return result instanceof Object ? result : obj;
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

// const person = new Person("yasin", 18);
const person = myNew(Person, "yasin", 18);
console.log(person); //Person { name: 'yasin', age: 18 }
console.log(person instanceof Person); //true
