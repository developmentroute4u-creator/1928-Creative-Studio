const fs = require('fs');

const content = fs.readFileSync('contact.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (i >= 4720 && i <= 5050) {
    if (l.includes('cal') || l.includes('Cal') || l.includes('month') || l.includes('Month') || l.includes('slot') || l.includes('Slot') || l.includes('days') || l.includes('Days')) {
      console.log(`${i + 1}: ${l.trim().slice(0, 100)}`);
    }
  }
});
