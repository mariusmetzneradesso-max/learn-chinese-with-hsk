
import fs from 'fs';

const lockfile = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

function validate(name, version) {
    if (!version) return;
    // Basic check for empty or obviously bad versions
    if (typeof version !== 'string' || version.trim() === '') {
        console.error(`ERROR: Package ${name} has invalid version: "${version}"`);
    }
    // You could import semver here if available, but let's just checking for string presence first
}

console.log('Validating package-lock.json versions...');
let count = 0;
if (lockfile.packages) {
    for (const [path, pkg] of Object.entries(lockfile.packages)) {
        if (pkg.version) {
            validate(path, pkg.version);
            count++;
        }
    }
}
console.log(`Checked ${count} packages.`);
