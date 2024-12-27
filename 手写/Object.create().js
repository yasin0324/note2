// Object.create()主要用于：
// 创建一个新的对象并设置其原型
// 基于现有对象创建新的对象，从而继承属性和方法
// 创建没有原型的纯净对象

function myCreate(proto) {
    // 创建一个空对象，且将原型设置为传入的proto
    function F() {}
    F.prototype = proto;

    // 返回一个新对象，原型链指向proto
    return new F();
}

// 示例用法
const animal = {
    sound: "growl",
    makeSound() {
        console.log(this.sound);
    },
};

const dog = myCreate(animal);
dog.sound = "bark";
dog.makeSound(); // 输出“bark”
