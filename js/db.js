/* ============================================
   DB.JS - localStorage based data management
   ============================================ */

const DB = {
  get(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  add(key, item) {
    const list = DB.get(key);
    item.id = Date.now() + Math.floor(Math.random() * 1000);
    list.push(item);
    DB.set(key, list);
    return item;
  },

  update(key, id, updates) {
    const list = DB.get(key);
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      DB.set(key, list);
      return list[idx];
    }
    return null;
  },

  remove(key, id) {
    const list = DB.get(key).filter(i => i.id !== id);
    DB.set(key, list);
  },

  findById(key, id) {
    return DB.get(key).find(i => i.id === id);
  }
};

/* ============================================
   CATEGORY → gradient mapping
   ============================================ */
const CATEGORY_STYLES = {
  'Technology': 'grad-tech',
  'Design':     'grad-design',
  'Music':      'grad-music',
  'Art':        'grad-art',
  'Business':   'grad-business',
  'Health':     'grad-health',
  'Food':       'grad-food',
  'Education':  'grad-edu',
  'Sports':     'grad-sports'
};

/* ============================================
   SEED DATA - Sample events (4+ per category)
   ============================================ */
function seedData() {
  if (localStorage.getItem('seeded_v3')) return;

  // Clean old versions
  localStorage.removeItem('seeded');
  localStorage.removeItem('seeded_v2');

  const sampleUsers = [
    { id: 1, name: 'Admin User', email: 'admin@eventhub.com', password: 'admin123', role: 'organizer' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@eventhub.com', password: 'sarah123', role: 'organizer' },
    { id: 3, name: 'Michael Chen', email: 'michael@eventhub.com', password: 'michael123', role: 'organizer' }
  ];

  const sampleEvents = [
    /* ========== TECHNOLOGY (5) ========== */
    {
      id: 101,
      title: 'Modern React Development Masterclass',
      description: 'Dive deep into React Hooks, Context API, and modern React patterns. Build a full project from scratch with real-world best practices. Perfect for developers transitioning from vanilla JavaScript.',
      category: 'Technology',
      date: '2026-05-15T14:00',
      location: 'San Francisco, CA',
      capacity: 50, registered: 32,
      organizerId: 1, organizerName: 'Admin User',
      icon: '⚛️', price: 0
    },
    {
      id: 102,
      title: 'Python for Data Science',
      description: 'Comprehensive introduction to Python for data analysis. Cover NumPy, Pandas, and Matplotlib. Analyze real datasets and build your first predictive model.',
      category: 'Technology',
      date: '2026-06-20T11:00',
      location: 'Seattle, WA',
      capacity: 60, registered: 41,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🐍', price: 89
    },
    {
      id: 103,
      title: 'AI & Machine Learning Essentials',
      description: 'Understand AI and ML fundamentals. Learn about neural networks, build your first model with TensorFlow, and explore real-world applications of artificial intelligence.',
      category: 'Technology',
      date: '2026-07-05T13:00',
      location: 'Boston, MA',
      capacity: 100, registered: 78,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '🤖', price: 149
    },
    {
      id: 104,
      title: 'Web3 & Blockchain Workshop',
      description: 'Explore the decentralized web. Understand smart contracts, build your first dApp with Solidity, and dive into the future of the internet.',
      category: 'Technology',
      date: '2026-06-15T10:00',
      location: 'Online (Zoom)',
      capacity: 80, registered: 52,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '⛓️', price: 99
    },
    {
      id: 105,
      title: 'iOS App Development with Swift',
      description: 'Build your first native iOS application. Learn Swift, SwiftUI, and publish to the App Store. Mac with Xcode required.',
      category: 'Technology',
      date: '2026-07-22T09:00',
      location: 'Cupertino, CA',
      capacity: 35, registered: 24,
      organizerId: 1, organizerName: 'Admin User',
      icon: '📱', price: 175
    },

    /* ========== DESIGN (4) ========== */
    {
      id: 201,
      title: 'UI/UX Design Fundamentals with Figma',
      description: 'Learn the essentials of user interface and experience design using Figma. Hands-on exercises covering wireframing, prototyping, and design systems.',
      category: 'Design',
      date: '2026-05-22T10:00',
      location: 'Online (Zoom)',
      capacity: 80, registered: 54,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🎨', price: 49
    },
    {
      id: 202,
      title: 'Brand Identity Design Intensive',
      description: 'Create memorable brand identities from scratch. Logo design, color theory, typography, and brand guidelines. Walk away with a complete portfolio piece.',
      category: 'Design',
      date: '2026-06-10T13:00',
      location: 'New York City, NY',
      capacity: 30, registered: 19,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '✨', price: 135
    },
    {
      id: 203,
      title: 'Motion Graphics with After Effects',
      description: 'Bring designs to life with motion graphics. Learn animation principles, kinetic typography, and create stunning motion pieces for video content.',
      category: 'Design',
      date: '2026-07-08T14:00',
      location: 'Los Angeles, CA',
      capacity: 25, registered: 18,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🎬', price: 120
    },
    {
      id: 204,
      title: 'Typography Fundamentals Workshop',
      description: 'Master the art of type. Pairing, hierarchy, and advanced typographic principles for print and digital design.',
      category: 'Design',
      date: '2026-08-02T11:00',
      location: 'Online (Zoom)',
      capacity: 50, registered: 32,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '🔤', price: 35
    },

    /* ========== MUSIC (4) ========== */
    {
      id: 301,
      title: 'Acoustic Guitar Workshop for Beginners',
      description: 'Start your musical journey with acoustic guitar basics. Learn chord progressions, strumming patterns, and play popular songs by session end.',
      category: 'Music',
      date: '2026-06-05T18:30',
      location: 'Nashville, TN',
      capacity: 25, registered: 18,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🎸', price: 75
    },
    {
      id: 302,
      title: 'Jazz Night: Live Music & Improv',
      description: 'An intimate evening of live jazz performances and improvisation workshops. Musicians of all levels welcome to jam. Bring your instrument!',
      category: 'Music',
      date: '2026-07-18T20:00',
      location: 'New Orleans, LA',
      capacity: 60, registered: 38,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🎺', price: 20
    },
    {
      id: 303,
      title: 'DJ Mixing & Music Production',
      description: 'From beat matching to track production. Learn Ableton Live basics, mix live, and produce your first electronic track.',
      category: 'Music',
      date: '2026-06-28T19:00',
      location: 'Miami, FL',
      capacity: 20, registered: 14,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '🎧', price: 95
    },
    {
      id: 304,
      title: 'Piano for Complete Beginners',
      description: 'No musical background required. Learn to read sheet music, understand keys, and play your first melody by the end of the class.',
      category: 'Music',
      date: '2026-05-29T17:00',
      location: 'Chicago, IL',
      capacity: 15, registered: 9,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🎹', price: 60
    },

    /* ========== ART (4) ========== */
    {
      id: 401,
      title: 'Digital Photography Bootcamp',
      description: 'Master composition, lighting, and color theory. Outdoor practical shooting sessions included. DSLR or smartphone camera welcome.',
      category: 'Art',
      date: '2026-05-30T09:00',
      location: 'Los Angeles, CA',
      capacity: 30, registered: 12,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '📷', price: 120
    },
    {
      id: 402,
      title: 'Watercolor Painting for Beginners',
      description: 'Explore the beautiful world of watercolor art. Learn brush techniques, color mixing, and create your first landscape painting. All supplies included.',
      category: 'Art',
      date: '2026-05-25T14:00',
      location: 'Portland, OR',
      capacity: 15, registered: 9,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🖌️', price: 65
    },
    {
      id: 403,
      title: 'Oil Painting Masterclass',
      description: 'Traditional oil painting techniques for intermediate artists. Still life composition, layering, and glazing methods used by the masters.',
      category: 'Art',
      date: '2026-07-14T13:00',
      location: 'Santa Fe, NM',
      capacity: 12, registered: 7,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '🎨', price: 145
    },
    {
      id: 404,
      title: 'Street Photography Walk & Talk',
      description: 'Join us for a guided photo walk through the city. Learn to capture candid moments, urban textures, and tell visual stories.',
      category: 'Art',
      date: '2026-06-22T08:00',
      location: 'Brooklyn, NY',
      capacity: 20, registered: 16,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '📸', price: 40
    },

    /* ========== BUSINESS (4) ========== */
    {
      id: 501,
      title: 'Startup Founders Summit 2026',
      description: 'Network with successful entrepreneurs, learn business model strategies, and get insights on securing investors. Panel discussions with industry leaders.',
      category: 'Business',
      date: '2026-06-12T13:00',
      location: 'New York City, NY',
      capacity: 200, registered: 147,
      organizerId: 1, organizerName: 'Admin User',
      icon: '💼', price: 0
    },
    {
      id: 502,
      title: 'Digital Marketing & SEO Workshop',
      description: 'Master modern digital marketing strategies including SEO, social media campaigns, and content marketing. Practical tools and real case studies.',
      category: 'Business',
      date: '2026-07-10T10:00',
      location: 'Online (Zoom)',
      capacity: 150, registered: 87,
      organizerId: 1, organizerName: 'Admin User',
      icon: '📈', price: 29
    },
    {
      id: 503,
      title: 'Personal Finance & Investing 101',
      description: 'Take control of your financial future. Budgeting, saving strategies, intro to stocks and index funds. Ideal for young professionals.',
      category: 'Business',
      date: '2026-05-26T18:00',
      location: 'Online (Zoom)',
      capacity: 100, registered: 64,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '💰', price: 15
    },
    {
      id: 504,
      title: 'Product Management Fundamentals',
      description: 'What does a PM actually do? Learn frameworks, prioritization, user research, and stakeholder management from an ex-FAANG PM.',
      category: 'Business',
      date: '2026-08-05T12:00',
      location: 'Seattle, WA',
      capacity: 40, registered: 22,
      organizerId: 1, organizerName: 'Admin User',
      icon: '📊', price: 110
    },

    /* ========== HEALTH (4) ========== */
    {
      id: 601,
      title: 'Yoga & Mindfulness Retreat',
      description: 'Deep relaxation techniques, stress management, and guided meditation. Connect with your inner self in a peaceful environment. Bring your yoga mat.',
      category: 'Health',
      date: '2026-05-18T08:00',
      location: 'Austin, TX',
      capacity: 40, registered: 28,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🧘', price: 35
    },
    {
      id: 602,
      title: 'Nutrition & Healthy Meal Planning',
      description: 'Plan nutritious meals for a healthier lifestyle. Covers macronutrients, portion control, and practical recipes. Nutritionist-led with Q&A.',
      category: 'Health',
      date: '2026-06-22T11:00',
      location: 'Online (Zoom)',
      capacity: 100, registered: 63,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🥗', price: 15
    },
    {
      id: 603,
      title: 'HIIT & Strength Training Class',
      description: 'Fast-paced, high-intensity interval training combined with strength fundamentals. All fitness levels welcome. Expect to sweat!',
      category: 'Health',
      date: '2026-05-24T07:00',
      location: 'San Diego, CA',
      capacity: 25, registered: 17,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '💪', price: 20
    },
    {
      id: 604,
      title: 'Mental Health Awareness Circle',
      description: 'A safe, supportive space to discuss mental wellness. Licensed therapist-guided conversations, coping techniques, and community support.',
      category: 'Health',
      date: '2026-06-30T19:00',
      location: 'Online (Zoom)',
      capacity: 30, registered: 15,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '🫶', price: 0
    },

    /* ========== FOOD (4) ========== */
    {
      id: 701,
      title: 'Italian Cooking Masterclass',
      description: 'Learn authentic Italian cuisine from pasta-making to tiramisu. Hands-on kitchen experience with professional chefs. All ingredients provided.',
      category: 'Food',
      date: '2026-06-08T17:00',
      location: 'Chicago, IL',
      capacity: 20, registered: 19,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🍝', price: 95
    },
    {
      id: 702,
      title: 'Sushi Making Workshop',
      description: 'Master the art of sushi-making with a professional chef. Learn to prepare rice, roll maki, and create beautiful nigiri. Premium ingredients included.',
      category: 'Food',
      date: '2026-07-02T16:00',
      location: 'San Diego, CA',
      capacity: 16, registered: 16,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🍣', price: 110
    },
    {
      id: 703,
      title: 'Wine Tasting Experience',
      description: 'Explore wines from around the world with a sommelier. Learn about tasting notes, food pairings, and the stories behind each bottle.',
      category: 'Food',
      date: '2026-06-14T18:30',
      location: 'Napa Valley, CA',
      capacity: 24, registered: 18,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🍷', price: 85
    },
    {
      id: 704,
      title: 'Thai Street Food Cooking Class',
      description: 'Pad Thai, Tom Yum, Green Curry and more. Authentic Thai recipes taught by a Bangkok-trained chef. All ingredients and tools provided.',
      category: 'Food',
      date: '2026-07-26T15:00',
      location: 'Houston, TX',
      capacity: 18, registered: 11,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '🍜', price: 75
    },

    /* ========== EDUCATION (4) ========== */
    {
      id: 801,
      title: 'Public Speaking & Confidence Building',
      description: 'Overcome stage fright and deliver compelling presentations. Practice sessions with feedback, body language techniques, and storytelling frameworks.',
      category: 'Education',
      date: '2026-06-15T18:00',
      location: 'Online (Zoom)',
      capacity: 40, registered: 22,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🎤', price: 0
    },
    {
      id: 802,
      title: 'Spanish Conversation Workshop',
      description: 'Practice conversational Spanish in small groups. Interactive exercises, cultural insights, and real-life scenarios. For intermediate learners.',
      category: 'Education',
      date: '2026-06-28T19:00',
      location: 'Miami, FL',
      capacity: 25, registered: 14,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🗣️', price: 40
    },
    {
      id: 803,
      title: 'Creative Writing Workshop',
      description: 'Unlock your storytelling voice. Short fiction techniques, character development, and dialogue. Walk away with a first draft of your own story.',
      category: 'Education',
      date: '2026-07-12T14:00',
      location: 'Portland, OR',
      capacity: 20, registered: 13,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '✍️', price: 30
    },
    {
      id: 804,
      title: 'French Language Intensive',
      description: 'Accelerated French for beginners. 4-hour immersion with native speakers. Everyday phrases, pronunciation, and cultural tips included.',
      category: 'Education',
      date: '2026-08-10T10:00',
      location: 'Online (Zoom)',
      capacity: 30, registered: 17,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🥐', price: 55
    },

    /* ========== SPORTS (4) ========== */
    {
      id: 901,
      title: 'Morning Marathon Training',
      description: 'Weekly group training for upcoming marathon. Professional coach leading intervals, long runs, and recovery strategies. Intermediate+ runners.',
      category: 'Sports',
      date: '2026-05-20T06:30',
      location: 'Denver, CO',
      capacity: 35, registered: 20,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🏃', price: 25
    },
    {
      id: 902,
      title: 'Rock Climbing for Beginners',
      description: 'Introduction to indoor rock climbing. Safety basics, climbing techniques, and guided climbs on beginner routes. All equipment provided.',
      category: 'Sports',
      date: '2026-05-28T15:00',
      location: 'Salt Lake City, UT',
      capacity: 18, registered: 11,
      organizerId: 2, organizerName: 'Sarah Johnson',
      icon: '🧗', price: 55
    },
    {
      id: 903,
      title: 'Urban Cycling Tour Adventure',
      description: 'Guided cycling tour through the city. Discover hidden spots, scenic routes, and end at a local cafe. Bike rental available on request.',
      category: 'Sports',
      date: '2026-06-18T09:00',
      location: 'Portland, OR',
      capacity: 30, registered: 19,
      organizerId: 3, organizerName: 'Michael Chen',
      icon: '🚴', price: 35
    },
    {
      id: 904,
      title: 'Beach Volleyball Tournament',
      description: 'Join our friendly summer beach volleyball tournament. Teams of 4, prizes for winners, BBQ after. Intermediate level recommended.',
      category: 'Sports',
      date: '2026-07-20T10:00',
      location: 'Santa Monica, CA',
      capacity: 48, registered: 32,
      organizerId: 1, organizerName: 'Admin User',
      icon: '🏐', price: 45
    }
  ];

  DB.set('users', sampleUsers);
  DB.set('events', sampleEvents);
  DB.set('registrations', []);
  localStorage.setItem('seeded_v3', 'true');
}

seedData();
