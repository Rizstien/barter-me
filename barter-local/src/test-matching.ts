const haversine = require('haversine-distance');
const Fuse = require('fuse.js');

// Test 1: Haversine
const start = { lat: 31.5204, lon: 74.3587 };
const end = { lat: 31.5244, lon: 74.3627 }; // Slightly away

try {
    const dist = haversine(start, end);
    console.log('Haversine Test 1 ({lat, lon}):', dist);
} catch (e) {
    console.log('Haversine Test 1 Failed:', e);
}

const start2 = { latitude: 31.5204, longitude: 74.3587 };
const end2 = { latitude: 31.5244, longitude: 74.3627 };

try {
    const dist2 = haversine(start2, end2);
    console.log('Haversine Test 2 ({latitude, longitude}):', dist2);
} catch (e) {
    console.log('Haversine Test 2 Failed:', e);
}

// Test 2: Fuse
const myTitle = "Phone";
const theirWant = "Phone";

const list = [{ t: myTitle }];
const fuse = new Fuse(list, { keys: ['t'], threshold: 0.4 });
const result = fuse.search(theirWant);
console.log('Fuse exact match length:', result.length);

const myTitle2 = "iPhone 12";
const list2 = [{ t: myTitle2 }];
const fuse2 = new Fuse(list2, { keys: ['t'], threshold: 0.4 });
const result2 = fuse2.search(theirWant);
console.log('Fuse substring match length (iPhone 12 vs Phone):', result2.length);
if (result2.length > 0) console.log('Score:', result2[0].score);
