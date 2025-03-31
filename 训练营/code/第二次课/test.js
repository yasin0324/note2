function test(n) {
    n = 456;
    function fn() {
        console.log(n);
    }
    fn();
}

let n = 123;
test(n);
