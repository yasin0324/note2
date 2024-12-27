// instanceof是JavaScript中的一个运算符，用于检测一个对象是否是某个类（构造函数）的实例。
// 它可以用来判断对象的原型链上是否包含特定的构造函数的prototype对象

// 语法
// object instanceof constructor
// object：需要检查的对象
// constructor：构造函数，用于检查object是否是该构造函数的实例
// 如果object是constructor构造函数的实例（即object的原型链上包含constructor.prototype），则返回true，否则返回false

// 工作原理：
// instanceof运算符检查的是object的原型链中是否存在constructor.prototype。
// 具体来说，它会从object开始，沿着原型链(__proto__)逐层向上查找，直到找到constructor.prototype或者到达原型链的末端(null)。如果找到了constructor.prototype，则返回true，否则返回false

// 手写instanceof
// 实现步骤
// 1.首先获取类型的原型
// 2.然后获得对象的原型
// 3.然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为null，因为原型链最终为null
function myInstanceof(obj, constructor) {
    // 获取obj的原型
    let prototype = Object.getPrototypeOf(obj);

    // 逐层向上查找，直到找到构造函数的prototype或者到达原型链的末尾
    while (prototype !== null) {
        if (prototype === constructor.prototype) {
            return true;
        }
        prototype = Object.getPrototypeOf(prototype);
    }

    return false;
}

// 示例用法
// function Animal() {}
// const dog = new Animal();

// console.log(myInstanceof(dog, Animal)); //true
// console.log(myInstanceof(dog, Object)); //true
// console.log(myInstanceof(dog, Array)); //false

function Animal() {}
function Dog() {}

Dog.prototype = new Animal(); //Dog继承Animal

const myDog = new Dog();

console.log(myInstanceof(myDog, Dog)); //true
console.log(myInstanceof(myDog, Animal)); //true
console.log(myInstanceof(myDog, Object)); //true
