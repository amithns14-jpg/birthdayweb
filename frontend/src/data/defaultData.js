// Default celebration data for instant, zero-delay rendering on Vercel and offline resilience

export const DEFAULT_PROFILE = {
  id: 1,
  person_name: "Sophia",
  birthday_date: "November 16",
  welcome_headline: "Hey! Someone Special Has a Birthday Today! ✨",
  hero_subtitle: "Today is all about you. May your life always be filled with happiness, love, and unforgettable memories.",
  cake_wish_message: "Close your eyes, make the deepest wish in your heart, and blow out the candles! May every dream you whisper to the stars come true! 🎂✨",
  letter_title: "A Heartfelt Letter For The Most Wonderful Person",
  letter_content: "On your special day, I just want to remind you how amazing you are. May every dream you carry become a beautiful reality. Keep smiling, keep shining, and never stop being the wonderful person you are.\n\nFrom the moment you walk into a room, you bring laughter, genuine warmth, and effortless grace. Having you in this world makes everything so much better, happier, and brighter. You inspire everyone around you to be kinder and to dream bigger.\n\nHere is to another 365 days of wild adventures, spontaneous belly-laughs, dreams coming true, and peace in your heart. Happy Birthday, beautiful soul!",
  letter_signature: "With all my warmest love and endless blessings ❤️",
  closing_headline: "Once Again, Happy Birthday! 🎂",
  closing_message: "May your smile never fade, your dreams never stop, and your happiness never end."
};

export const DEFAULT_PHOTOS = [
  {
    id: 1,
    file_path: "/uploads/photos/photo_1.jpg",
    original_filename: "magical_sparkle.jpg",
    caption: "Your radiant smile that lights up every room ✨",
    is_featured: true,
    order_index: 1
  },
  {
    id: 2,
    file_path: "/uploads/photos/photo_2.jpg",
    original_filename: "golden_hour.jpg",
    caption: "Golden hour vibes and endless laughs 🌅",
    is_featured: false,
    order_index: 2
  },
  {
    id: 3,
    file_path: "/uploads/photos/photo_3.jpg",
    original_filename: "pure_joy.jpg",
    caption: "Pure joy captured in a single frame 💖",
    is_featured: false,
    order_index: 3
  },
  {
    id: 4,
    file_path: "/uploads/photos/photo_4.jpg",
    original_filename: "starlit_night.jpg",
    caption: "Under the stars, making unforgettable memories 🌌",
    is_featured: false,
    order_index: 4
  },
  {
    id: 5,
    file_path: "/uploads/photos/photo_5.jpg",
    original_filename: "celebration_cake.jpg",
    caption: "Sweet moments and sweet celebrations 🎂",
    is_featured: false,
    order_index: 5
  },
  {
    id: 6,
    file_path: "/uploads/photos/photo_6.jpg",
    original_filename: "cherished_smiles.jpg",
    caption: "May this year bring you endless happiness 🌸",
    is_featured: false,
    order_index: 6
  }
];

export const DEFAULT_MEMORIES = [
  {
    id: 1,
    title: "The Day We First Laughed Non-Stop",
    date_str: "A Sunny Afternoon",
    description: "That spontaneous afternoon when we couldn't stop laughing until tears streamed down our faces. Some memories stay permanently etched in gold.",
    image_path: "/uploads/memories/memory_1.jpg",
    order_index: 1
  },
  {
    id: 2,
    title: "Coffee Chats & Late Night Talks",
    date_str: "Under City Lights",
    description: "Talking about big dreams, favorite books, and all the silly secrets. Finding someone who listens with their whole heart is the greatest gift.",
    image_path: "/uploads/memories/memory_2.jpg",
    order_index: 2
  },
  {
    id: 3,
    title: "Celebrating Your Big Milestone",
    date_str: "A Day of Triumph",
    description: "Watching you achieve something you worked so tirelessly for. Your resilience and determination inspire everyone who knows you.",
    image_path: "/uploads/memories/memory_3.jpg",
    order_index: 3
  },
  {
    id: 4,
    title: "Birthday Eve Anticipation",
    date_str: "Every Birthday Eve",
    description: "Counting down the seconds to midnight just to be the first to scream 'Happy Birthday!' and celebrate the extraordinary person you are.",
    image_path: "/uploads/memories/memory_4.jpg",
    order_index: 4
  }
];

export const DEFAULT_SURPRISES = [
  {
    id: 1,
    title: "Surprise #1: An Eternal Wish Token",
    preview_hint: "A tiny box wrapped in rose ribbon...",
    secret_content: "🎟️ GOLDEN BIRTHDAY VOUCHER: Good for unlimited warm hugs, midnight ice cream cravings, and lifelong loyalty whenever you need it!",
    badge: "Secret Gift",
    order_index: 1
  },
  {
    id: 2,
    title: "Surprise #2: 3 Things I Adore About You",
    preview_hint: "Tap to unlock 3 heartfelt truths...",
    secret_content: "1. Your infectious laugh that turns gloomy days bright.\n2. How deeply and sincerely you care for others.\n3. Your courage to chase whatever sets your soul on fire.",
    badge: "Heartfelt Truths",
    order_index: 2
  },
  {
    id: 3,
    title: "Surprise #3: The Grand Fortune Prediction",
    preview_hint: "Peek into your upcoming year...",
    secret_content: "🔮 THE STARS HAVE SPOKEN: This year will bring unexpected joy, thrilling journeys, deeper peace, new milestones achieved, and plenty of cake!",
    badge: "Fortune",
    order_index: 3
  }
];

export const DEFAULT_MESSAGES = [
  {
    id: 1,
    sender_name: "Alex & Maya",
    relationship: "Best Friends",
    message: "Happy Birthday to the most energetic, kind, and wonderful soul! May your year be as dazzling as you are!",
    avatar_color: "from-purple-500 to-indigo-500"
  },
  {
    id: 2,
    sender_name: "Mom & Dad",
    relationship: "Family",
    message: "Watching you grow into such a compassionate and graceful person is our greatest blessing. Keep shining brightly!",
    avatar_color: "from-pink-500 to-rose-500"
  },
  {
    id: 3,
    sender_name: "Jordan",
    relationship: "Partner in Crime",
    message: "Here's to another year of terrible karaoke, legendary road trips, and laughing at jokes only we understand!",
    avatar_color: "from-amber-400 to-orange-500"
  }
];
