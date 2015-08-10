'use strict';

function* genFunc() {
  console.log('First');
  yield 'a';
  yield 'b';
  console.log('Second');
  return 1;
}


for(let value of genFunc()) {
  console.log(value);
}

const genObj = genFunc();
console.log('starting');
console.log(genObj.next());
console.log(genObj.next());
console.log(genObj.next());
