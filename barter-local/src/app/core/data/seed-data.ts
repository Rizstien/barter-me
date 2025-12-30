import { Offer } from '../models/offer.model';

// Lahore Center
const CENTER_LAT = 31.5204;
const CENTER_LON = 74.3587;

function createOffer(
    data: Partial<Offer> & Pick<Offer, 'id' | 'userId' | 'offer' | 'want'>
): Offer {
    return {
        title: `Offer for ${data.offer}`, // Default title if not provided
        description: '',
        imageUrl: '',
        createdAt: new Date(),
        ...data
    };
}

export const MOCK_OFFERS: Offer[] = [
    // --- User 1: user1@barter.com ---
    createOffer({
        id: '1', userId: 'user1@barter.com', title: 'Brand new Microwave in Box!', offer: 'Microwave', want: 'Books',
        description: 'Received as a gift, never opened. Looking for some good novels.', price: 15000,
        imageUrl: 'https://cdn.dummyjson.com/product-images/kitchen-accessories/microwave-oven/1.webp', condition: 'new'
    }),
    createOffer({
        id: '2', userId: 'user1@barter.com', title: 'Calculus Textbooks Bundle', offer: 'Textbooks', want: 'Scientific Calculator',
        description: 'Year 1 and 2 Engineering math books.', price: 5000,
        imageUrl: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'good'
    }),
    createOffer({
        id: '3', userId: 'user1@barter.com', title: 'Men\'s Leather Jacket', offer: 'Leather Jacket', want: 'Wireless Earbuds',
        description: 'Genuine leather, medium size. Barely worn.', price: 12000,
        imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'like-new'
    }),
    createOffer({
        id: '4', userId: 'user1@barter.com', title: 'Old Tennis Racket', offer: 'Tennis Racket', want: 'Cricket Bat',
        description: 'Wilson racket, needs restringing.', price: 3000,
        imageUrl: 'https://images.pexels.com/photos/5782695/pexels-photo-5782695.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'fair'
    }),

    // --- User 2: user2@barter.com ---
    createOffer({
        id: '5', userId: 'user2@barter.com', title: 'MacBook Air - Perfect for Students', offer: 'MacBook Air M1', want: 'Bicycle',
        description: 'Lightly used, perfect battery. Need a bike.', price: 160000,
        imageUrl: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp', condition: 'excellent'
    }),
    createOffer({
        id: '6', userId: 'user2@barter.com', title: 'Study Lamp (LED)', offer: 'Desk Lamp', want: 'Plant Pots',
        description: 'Adjustable brightness, USB powered.', price: 2000,
        imageUrl: 'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/1.webp', condition: 'like-new'
    }),
    createOffer({
        id: '7', userId: 'user2@barter.com', title: 'Yoga Mat & Blocks', offer: 'Yoga Set', want: 'Dumbbells',
        description: 'Purple mat with two foam blocks.', price: 4000,
        imageUrl: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'good'
    }),
    createOffer({
        id: '8', userId: 'user2@barter.com', title: 'Coffee Maker (Drip)', offer: 'Coffee Maker', want: 'Toaster',
        description: 'Makes 12 cups. Glass carafe included.', price: 6000,
        imageUrl: 'https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'good'
    }),

    // --- User 3: user3@barter.com ---
    createOffer({
        id: '9', userId: 'user3@barter.com', title: 'Mountain Bike - Ready for Trails', offer: 'Mountain Bike', want: 'Phone',
        description: 'Well-maintained, recently serviced.', price: 28000,
        imageUrl: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'excellent'
    }),
    createOffer({
        id: '10', userId: 'user3@barter.com', title: 'Toolbox with Basic Tools', offer: 'Toolbox', want: 'Drill Machine',
        description: 'Steel toolbox with hammer, screwdrivers, wrench.', price: 5000,
        imageUrl: 'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'good'
    }),
    createOffer({
        id: '11', userId: 'user3@barter.com', title: 'Cricket Kit Bag', offer: 'Cricket Bag', want: 'Gym Bag',
        description: 'Large size, holds pads and bats.', price: 3500,
        imageUrl: 'https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'good'
    }),
    createOffer({
        id: '12', userId: 'user3@barter.com', title: 'Camping Tent (2 Person)', offer: 'Tent', want: 'Sleeping Bag',
        description: 'Used once for a trip to North.', price: 8000,
        imageUrl: 'https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'like-new'
    }),

    // --- User 4: user4@barter.com ---
    createOffer({
        id: '13', userId: 'user4@barter.com', title: 'PS5 Digital Edition', offer: 'PS5 Console', want: 'Laptop',
        description: 'One controller, works perfectly.', price: 120000,
        imageUrl: 'https://images.pexels.com/photos/3945657/pexels-photo-3945657.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'excellent'
    }),
    createOffer({
        id: '14', userId: 'user4@barter.com', title: 'Gaming Headset', offer: 'Headset', want: 'Mechanical Keyboard',
        description: 'RGB lighting, noise cancellation.', price: 7000,
        imageUrl: 'https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'like-new'
    }),
    createOffer({
        id: '15', userId: 'user4@barter.com', title: 'Graphic Design Tablet', offer: 'Wacom Tablet', want: 'Monitor',
        description: 'Good for beginners in digital art.', price: 10000,
        imageUrl: 'https://images.pexels.com/photos/221185/pexels-photo-221185.jpeg?auto=compress&cs=tinysrgb&w=800', condition: 'good'
    }),
    createOffer({
        id: '16', userId: 'user4@barter.com', title: 'Action Figure Collection', offer: 'Action Figures', want: 'Comics',
        description: 'Marvel legends, set of 5.', price: 15000,
        imageUrl: 'https://loremflickr.com/400/300/toys?lock=16', condition: 'excellent'
    }),

    // --- User 5: user5@barter.com ---
    createOffer({
        id: '17', userId: 'user5@barter.com', title: 'Vintage Acoustic Guitar', offer: 'Guitar', want: 'Headphones',
        description: 'Classic sound, new strings.', price: 18000,
        imageUrl: 'https://loremflickr.com/400/300/guitar?lock=17', condition: 'good'
    }),
    createOffer({
        id: '18', userId: 'user5@barter.com', title: 'Digital Camera DSLR', offer: 'Canon Camera', want: 'Drone',
        description: 'Old model but takes great photos. Lens included.', price: 35000,
        imageUrl: 'https://loremflickr.com/400/300/camera?lock=18', condition: 'good'
    }),
    createOffer({
        id: '19', userId: 'user5@barter.com', title: 'Painting Canvas & Easel', offer: 'Art Supplies', want: 'Sketchbook',
        description: 'Wood easel and blank canvases.', price: 6000,
        imageUrl: 'https://loremflickr.com/400/300/art?lock=19', condition: 'new'
    }),
    createOffer({
        id: '20', userId: 'user5@barter.com', title: 'Board Games Bundle', offer: 'Board Games', want: 'Puzzle',
        description: 'Monopoly, Ludo, and Chess.', price: 2500,
        imageUrl: 'https://loremflickr.com/400/300/games?lock=20', condition: 'good'
    })
];
