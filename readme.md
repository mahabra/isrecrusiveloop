IsRecrusiveLoop
--
Checking looping recursion

## Usage

```terminal
npm i morulus/isrecrusiveloop
```

```js
var isrecrusiveloop = require('isrecrusiveloop');
var someObjectWithRecrusiveNesting = {...}
isrecrusiveloop(someObjectWithRecrusiveNesting); // ["path", "to", "looping", "entry"]
```

Result without options can be false or be a array of xpath to the point of looping entry. 

The second argument of function can be TRUE or bitmask. If second argument is TRUE, then function will not return result when finds first detecting and will continue to search up, then it will return array of all problem xpaths or FALSE.

```js
isrecrusiveloop(someObjectWithRecrusiveNesting, true); // [["path", "to", "looping", "entry"], ["and", "another", "one"]]
```

## Using bitmask's option
There is two constants that you can use to specify type of return result. 
It is ISRECRUSIVELOOP_MULTIPLE - analogue of TRUE value of second argument (as in the previos example)
And ISRECRUSIVELOOP_THROW - enables the error throwing.

```js
  isrecrusiveloop(someObjectWithRecrusiveNesting, ISRECRUSIVELOOP_THROW); // It will throw error when it will find endless loop
```

## License
MIT
