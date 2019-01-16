import myCurrentLocation, { message, name, getGreeting } from './myModule'

import add, {substract} from './math';

console.log('reading message using import', message);
console.log('Name', name);
console.log('Current Location', myCurrentLocation);
console.log('Greetings', 'Karen');

console.log('Add 2 + 5 =', add(2, 5));
console.log('Substract 5 - 2 = ', substract(5,2));