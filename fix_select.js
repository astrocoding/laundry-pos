const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = [...walk('app'), ...walk('components')];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  // Match <select ... className="..."
  // Simple regex for our files since they are formatted consistently
  content = content.replace(/<select\s+([^>]*?)className="([^"]+)"([^>]*?)>/g, (match, p1, p2, p3) => {
    if (!p2.includes('pr-10')) {
      changed = true;
      // remove any existing pr-x
      let newClass = p2.replace(/\bpr-\d+\b/g, '').trim() + ' pr-10';
      return `<select ${p1}className="${newClass}"${p3}>`;
    }
    return match;
  });
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
