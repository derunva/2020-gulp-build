import test from './fns.js'
import $ from 'jquery'
import 'core-js/es6/promise'; 

(new Promise(function(resolve, reject) {
  setTimeout(resolve, 500)
})).then(() => {
  console.log('resolved');
})
