var names = ["abc", "cba", "nba", "dna"];

// slice截取数组时不会对原数组进行任何操作，而是生成一个新的数组
var newNames = names.slice(0, 2);
console.log(newNames);  //
console.log(names); // ["abc", "cba", "nba", "dna"]

// splice截取数组，会返回一个新的数组，也会对原数组进行修改
var newNames2 = names.splice(0, 2);
console.log(newNames2);
console.log(names);
