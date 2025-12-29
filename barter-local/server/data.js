// Copied from seed-data.ts, adapted for Node.js
const MOCK_OFFERS = [
    // --- User 1: user1@barter.com ---
    {
        id: '1', userId: 'user1@barter.com', title: 'Brand new Microwave in Box!', offer: 'Microwave', want: 'MacBook', // Changed want to MacBook
        description: 'Received as a gift, never opened. Looking for some good novels.', price: 15000,
        imageUrl: 'https://loremflickr.com/400/300/microwave,appliance?lock=1', createdAt: new Date()
    },
    {
        id: '2', userId: 'user1@barter.com', title: 'Calculus Textbooks Bundle', offer: 'Textbooks', want: 'Scientific Calculator',
        description: 'Year 1 and 2 Engineering math books.', price: 5000,
        imageUrl: 'https://loremflickr.com/400/300/books?lock=2', createdAt: new Date()
    },
    {
        id: '3', userId: 'user1@barter.com', title: 'Men\'s Leather Jacket', offer: 'Leather Jacket', want: 'Wireless Earbuds',
        description: 'Genuine leather, medium size. Barely worn.', price: 12000,
        imageUrl: 'https://loremflickr.com/400/300/jacket?lock=3', createdAt: new Date()
    },
    {
        id: '4', userId: 'user1@barter.com', title: 'Old Tennis Racket', offer: 'Tennis Racket', want: 'Cricket Bat',
        description: 'Wilson racket, needs restringing.', price: 3000,
        imageUrl: 'https://loremflickr.com/400/300/tennis?lock=4', createdAt: new Date()
    },

    // --- User 2: user2@barter.com ---
    {
        id: '5', userId: 'user2@barter.com', title: 'MacBook Air - Perfect for Students', offer: 'MacBook', want: 'Microwave', // Changed Offer to MacBook, Want to Microwave
        description: 'Lightly used, perfect battery. Need a bike.', price: 160000,
        imageUrl: 'https://loremflickr.com/400/300/macbook?lock=5', createdAt: new Date()
    },
    {
        id: '6', userId: 'user2@barter.com', title: 'Study Lamp (LED)', offer: 'Desk Lamp', want: 'Plant Pots',
        description: 'Adjustable brightness, USB powered.', price: 2000,
        imageUrl: 'https://loremflickr.com/400/300/lamp?lock=6', createdAt: new Date()
    },
    {
        id: '7', userId: 'user2@barter.com', title: 'Yoga Mat & Blocks', offer: 'Yoga Set', want: 'Dumbbells',
        description: 'Purple mat with two foam blocks.', price: 4000,
        imageUrl: 'https://loremflickr.com/400/300/yoga?lock=7', createdAt: new Date()
    },
    {
        id: '8', userId: 'user2@barter.com', title: 'Coffee Maker (Drip)', offer: 'Coffee Maker', want: 'Toaster',
        description: 'Makes 12 cups. Glass carafe included.', price: 6000,
        imageUrl: 'https://loremflickr.com/400/300/coffeemaker?lock=8', createdAt: new Date()
    },

    // --- User 3: user3@barter.com ---
    {
        id: '9', userId: 'user3@barter.com', title: 'Mountain Bike - Ready for Trails', offer: 'Mountain Bike', want: 'Phone',
        description: 'Well-maintained, recently serviced.', price: 28000,
        imageUrl: 'https://loremflickr.com/400/300/bicycle?lock=9', createdAt: new Date()
    },
    {
        id: '10', userId: 'user3@barter.com', title: 'Toolbox with Basic Tools', offer: 'Toolbox', want: 'Drill Machine',
        description: 'Steel toolbox with hammer, screwdrivers, wrench.', price: 5000,
        imageUrl: 'https://loremflickr.com/400/300/tools?lock=10', createdAt: new Date()
    },
    {
        id: '11', userId: 'user3@barter.com', title: 'Cricket Kit Bag', offer: 'Cricket Bag', want: 'Gym Bag',
        description: 'Large size, holds pads and bats.', price: 3500,
        imageUrl: 'https://loremflickr.com/400/300/bag?lock=11', createdAt: new Date()
    },
    {
        id: '12', userId: 'user3@barter.com', title: 'Camping Tent (2 Person)', offer: 'Tent', want: 'Sleeping Bag',
        description: 'Used once for a trip to North.', price: 8000,
        imageUrl: 'https://loremflickr.com/400/300/tent?lock=12', createdAt: new Date()
    },

    // --- User 4: user4@barter.com ---
    {
        id: '13', userId: 'user4@barter.com', title: 'PS5 Digital Edition', offer: 'PS5 Console', want: 'Laptop',
        description: 'One controller, works perfectly.', price: 120000,
        imageUrl: 'https://loremflickr.com/400/300/playstation?lock=13', createdAt: new Date()
    },
    {
        id: '14', userId: 'user4@barter.com', title: 'Gaming Headset', offer: 'Headset', want: 'Mechanical Keyboard',
        description: 'RGB lighting, noise cancellation.', price: 7000,
        imageUrl: 'https://loremflickr.com/400/300/headset?lock=14', createdAt: new Date()
    },
    {
        id: '15', userId: 'user4@barter.com', title: 'Graphic Design Tablet', offer: 'Wacom Tablet', want: 'Monitor',
        description: 'Good for beginners in digital art.', price: 10000,
        imageUrl: 'https://loremflickr.com/400/300/tablet?lock=15', createdAt: new Date()
    },
    {
        id: '16', userId: 'user4@barter.com', title: 'Action Figure Collection', offer: 'Action Figures', want: 'Comics',
        description: 'Marvel legends, set of 5.', price: 15000,
        imageUrl: 'https://loremflickr.com/400/300/toys?lock=16', createdAt: new Date()
    },

    // --- User 5: user5@barter.com ---
    {
        id: '17', userId: 'user5@barter.com', title: 'Vintage Acoustic Guitar', offer: 'Guitar', want: 'Headphones',
        description: 'Classic sound, new strings.', price: 18000,
        imageUrl: 'https://loremflickr.com/400/300/guitar?lock=17', createdAt: new Date()
    },
    {
        id: '18', userId: 'user5@barter.com', title: 'Digital Camera DSLR', offer: 'Canon Camera', want: 'Drone',
        description: 'Old model but takes great photos. Lens included.', price: 35000,
        imageUrl: 'https://loremflickr.com/400/300/camera?lock=18', createdAt: new Date()
    },
    {
        id: '19', userId: 'user5@barter.com', title: 'Painting Canvas & Easel', offer: 'Art Supplies', want: 'Sketchbook',
        description: 'Wood easel and blank canvases.', price: 6000,
        imageUrl: 'https://loremflickr.com/400/300/art?lock=19', createdAt: new Date()
    },
    {
        id: '20', userId: 'user5@barter.com', title: 'Board Games Bundle', offer: 'Board Games', want: 'Puzzle',
        description: 'Monopoly, Ludo, and Chess.', price: 2500,
        imageUrl: 'https://loremflickr.com/400/300/games?lock=20', createdAt: new Date()
    }
];

// Locations for users user1..user5
const USER_LOCATIONS = {
    'user1@barter.com': { lat: 31.5204, lon: 74.3587 },
    'user2@barter.com': { lat: 31.5304, lon: 74.3487 },
    'user3@barter.com': { lat: 31.5104, lon: 74.3687 },
    'user4@barter.com': { lat: 31.5254, lon: 74.3537 },
    'user5@barter.com': { lat: 31.5154, lon: 74.3637 }
};

module.exports = { MOCK_OFFERS, USER_LOCATIONS };
