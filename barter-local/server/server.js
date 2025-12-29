const express = require('express');
const cors = require('cors');
const Fuse = require('fuse.js');
const haversine = require('haversine-distance');
const { MOCK_OFFERS, USER_LOCATIONS } = require('./data');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- In-Memory State ---
let offers = [...MOCK_OFFERS]; // Clone to allow updates
let matches = [];
let messages = {}; // { matchId: [Message] }

// --- Helpers ---
const THRESHOLD = 0.6;
const RADIUS_METERS = 15000;

function isFuzzyMatch(text, query) {
    if (!text || !query) return false;
    const list = [{ t: text }];
    const fuse = new Fuse(list, { keys: ['t'], threshold: THRESHOLD });
    return fuse.search(query).length > 0;
}

function getLocation(userId) {
    // Default location if not found (should be found for seed users)
    return USER_LOCATIONS[userId] || { lat: 31.5204, lon: 74.3587 };
}

// Generate matches (Simplified version of Angular MatchingService)
function generateMatches() {
    console.log('Generating matches...');
    matches = []; // Reset or Append? For now reset to be clean on restart.

    const allOffers = offers;

    for (const myOffer of allOffers) {
        // Exclude my own offers from candidates
        const otherOffers = allOffers.filter(o => o.userId !== myOffer.userId);

        const fuse = new Fuse(otherOffers, {
            keys: ['offer', 'description'],
            threshold: THRESHOLD,
            includeScore: true
        });

        // 1. Direct Matches
        const potentialSellers = fuse.search(myOffer.want);

        for (const result of potentialSellers) {
            const theirOffer = result.item;

            // Geo filter
            const myLoc = getLocation(myOffer.userId);
            const theirLoc = getLocation(theirOffer.userId);
            const dist = haversine(myLoc, theirLoc);

            if (dist > RADIUS_METERS) continue;

            // Reverse check
            if (isFuzzyMatch(myOffer.offer, theirOffer.want)) {

                // Check if duplicate (A-B vs B-A)
                // Unique ID: sorted IDs of offers
                const ids = [myOffer.id, theirOffer.id].sort().join('-');
                // We generate match object, but check if we already have this pair
                if (!matches.find(m => m.uniqueKey === ids)) {
                    matches.push({
                        id: crypto.randomUUID(),
                        uniqueKey: ids, // internal dedup
                        type: 'direct',
                        offers: [myOffer, theirOffer],
                        score: (1 - (result.score || 0.5)),
                        priceDiff: 0,
                        createdAt: new Date(),
                        isRead: false,
                        acceptedBy: [],
                        status: 'active'
                    });
                }
            }
        }
    }
    console.log(`Generated ${matches.length} matches.`);
}

// Initial Generation
generateMatches();

// --- API Endpoints ---

// Get Offers
app.get('/api/offers', (req, res) => {
    res.json(offers);
});

// Create Offer
app.post('/api/offers', (req, res) => {
    const newOffer = req.body;
    if (!newOffer.userId || !newOffer.title) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Assign ID
    newOffer.id = crypto.randomUUID();
    newOffer.createdAt = new Date();

    offers.unshift(newOffer); // Add to top

    // Trigger Matching
    generateMatches();

    res.json(newOffer);
});

// Update Offer
app.put('/api/offers/:id', (req, res) => {
    const id = req.params.id;
    const update = req.body;
    const index = offers.findIndex(o => o.id === id);
    if (index !== -1) {
        offers[index] = { ...offers[index], ...update };
        res.json(offers[index]);
        // Ideally re-run matches here incrementally, but for demo we skip or manual re-gen
    } else {
        res.status(404).json({ error: 'Offer not found' });
    }
});

// Get Matches (Filter by userId)
app.get('/api/matches', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    // Return matches where ANY offer belongs to userId
    // Note: This logic assumes 'offers' array in match contains the Offer objects
    const userMatches = matches.filter(m =>
        m.offers.some(o => o.userId === userId)
    );
    res.json(userMatches);
});

// Accept Trade
app.post('/api/matches/:id/accept', (req, res) => {
    const matchId = req.params.id;
    const { userId } = req.body;
    const match = matches.find(m => m.id === matchId);

    if (match) {
        if (!match.acceptedBy.includes(userId)) {
            match.acceptedBy.push(userId);
        }
        // Check if all parties accepted
        const distinctUsers = new Set(match.offers.map(o => o.userId));
        if (match.acceptedBy.length >= distinctUsers.size) {
            match.status = 'accepted';
        }
        res.json(match);
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

// Complete Trade
app.post('/api/matches/:id/complete', (req, res) => {
    const matchId = req.params.id;
    const match = matches.find(m => m.id === matchId);
    if (match) {
        match.status = 'completed';
        res.json(match);
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

// MESSAGES
app.get('/api/messages/:matchId', (req, res) => {
    const matchId = req.params.matchId;
    res.json(messages[matchId] || []);
});

app.post('/api/messages', (req, res) => {
    const { matchId, text, senderId } = req.body;

    if (!messages[matchId]) {
        messages[matchId] = [];
    }

    const newMsg = {
        id: crypto.randomUUID(),
        matchId,
        senderId,
        text,
        timestamp: new Date()
    };

    messages[matchId].push(newMsg);
    res.json(newMsg);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
