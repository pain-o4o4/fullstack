
import fs from 'fs';

const content = fs.readFileSync('/Users/pain.o4o4/Documents/SOURCE/fullstack/ReactJS/src/containers/HomePage/HomeTabs/BookingFlowTab.scss', 'utf8');

let open = 0;
let close = 0;

for (let char of content) {
    if (char === '{') open++;
    if (char === '}') close++;
}

console.log('Open:', open);
console.log('Close:', close);
