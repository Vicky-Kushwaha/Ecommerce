// var x = 100;

// function scopeTest() {

//     console.log(x);

//     var x = 50;

//     console.log(x);

// }

// scopeTest();

// console.log(x);


// console.log("Start");

// setTimeout(() => console.log("Timeout"), 0);

// Promise.resolve().then(() => console.log("Promise"));

// console.log("End");

// async function foo() {

//     console.log("A");

//     await Promise.resolve();

//     console.log("B");

//     await Promise.resolve();

//     console.log("C");

// }

// console.log("Start");

// foo();

// console.log("End");

// var x = 10;

// function first() {

//     var x = 20;

    

//     function second() {

//         var x = 30;

//         console.log(x);

//     }

//     second();

//     console.log(x);

// }

// first();

// console.log(x);


/register (POST api)

 

(userSchema )

 

name (string)

email (string, unique)

password (string)

 

Hash the password before you save in mongo database

 

Also create a middlewares that check if name is "admin" return error response. (unauthorize and 401 status code)