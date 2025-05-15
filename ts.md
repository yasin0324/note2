# type和interface的区别

---

## 1. 定义方式

- interface：用于定义对象的结构，包括属性和方法

  ```ts
  interface Person {
    name: string;
    age: number;
    greet(): void;
  }
  ```

- type：可以用于定义任何类型，包括基本类型、联合类型、元组等

  ```ts
  type Person = {
    name: string;
    age: number;
    greet(): void;
  }
  type StringOrNumber = string | number;
  type Tuple = [number, string];
  ```

## 2. 扩展（继承）

- interface：可以通过`extends`关键字进行扩展，可以继承一个活多个interface

  ```ts
  interface Person {
    name: string;
    age: number;
  }
  interface Employee extends Person {
    salary: number;
  }
  ```

- type：可以通过交叉类型`&`进行扩展

  ```ts
  type Person = {
    name: string;
    age: number;
  }
  type Employee = Person & {
    salary: number;
  }
  ```

## 3.  合并声明

- interface：同名interface会自动合并

  ```ts
  interface User {
    id: number;
  }
  
  interface User {
    name: string;
  }
  
  const user: User = {
    id: 1,
    name: "John",
  };
  ```

- type：同名type无法合并，会直接报错

  ```ts
  type User = {
    id: number;
  };
  // 标识符User重复
  type User = {
    name: string;
  };
  ```

## 4. 使用范围

- interface：主要用于定义对象的结构，例如类、对象、函数签名等
- type：可以定义**任何类型**（基本类型、对象、联合类型、元素、映射类型等）

## 5. 区别总结

| 特性         | interface | type      |
| ------------ | --------- | --------- |
| 定义对象结构 | ✅支持     | ✅支持     |
| 定义基本类型 | ❌不支持   | ✅支持     |
| 扩展（继承） | extends   | &         |
| 合并声明     | ✅自动合并 | ❌无法合并 |
| 映射类型     | ❌不支持   | ✅支持     |
| 联合类型     | ❌不支持   | ✅支持     |

## 6. 实际应用建议

- 如果是 **定义对象结构**（尤其是在设计类或模块接口时），**优先使用 interface**，因为它支持声明合并，便于扩展。
- 如果需要定义 **联合类型、元组、映射类型、复杂类型组合**，则 **使用 type**。

 ```ts
 // 例子：
 // 推荐使用interface:
 interface Car {
   model: string;
   year: number;
 }
 
 interface ElectricCar extends Car {
   batteryCapacity: number;
 }
 
 // 推荐使用type:
 type Status = "active" | "inactive" | "pending";
 type Point = [number, number];
 type ID = string | number;
 ```

