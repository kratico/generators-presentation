'use strict';

console.info('genFunc1');

function* genFunc1() {
  try {
    console.log('Started');
    yield; // (A)
  } catch (ex) {
    console.error('Caught', ex);
  } finally {
    console.log('Exiting');
  }
}

let genObj1 = genFunc1();
genObj1.next();

genObj1.throw(new Error('Problem!'));

console.info('genFunc2');

function* genFunc2() {
  try {
    console.log('Started');
    yield; // (A)
  } finally {
    console.log('Exiting');
  }
}

let genObj2 = genFunc2();
genObj2.next();

genObj2.throw(new Error('Problem!'));
