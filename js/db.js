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
   SEED DATA - Sample events
   ============================================ */
function seedData() {
  if (localStorage.getItem('seeded_v2')) return;

  // Clean old v1 data
  localStorage.removeItem('seeded');

  const sampleUsers = [
    { id: 1, name: 'Admin User', email: 'admin@eventhub.com', password: 'admin123', role: 'organizer' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@eventhub.com', password: 'sarah123', role: 'organizer' }
  ];

  const sampleEvents = [
    {
      id: 101,
      title: 'Modern React Development Masterclass',
      description: 'Dive deep into React Hooks, Context API, and modern React patterns. Build a full project from scratch with real-world best practices. Perfect for beginners transitioning from vanilla JavaScript.',
      category: 'Technology',
      date: '2026-05-15T14:00',
      location: 'San Francisco, CA',
      capacity: 50,
      registered: 32,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '⚛️',
      price: 0
    },
    {
      id: 102,
      title: 'UI/UX Design Fundamentals with Figma',
      description: 'Learn the essentials of user interface and experience design using Figma. Hands-on exercises covering wireframing, prototyping, and creating design systems for modern web and mobile apps.',
      category: 'Design',
      date: '2026-05-22T10:00',
      location: 'Online (Zoom)',
      capacity: 80,
      registered: 54,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '🎨',
      price: 49
    },
    {
      id: 103,
      title: 'Acoustic Guitar Workshop for Beginners',
      description: 'Start your musical journey with acoustic guitar basics. Learn chord progressions, strumming patterns, and play popular songs by the end of the session. No prior experience required.',
      category: 'Music',
      date: '2026-06-05T18:30',
      location: 'Nashville, TN',
      capacity: 25,
      registered: 18,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🎸',
      price: 75
    },
    {
      id: 104,
      title: 'Digital Photography Bootcamp',
      description: 'Master composition, lighting, and color theory. Outdoor practical shooting sessions included. Bring your DSLR or smartphone camera and unleash your creativity.',
      category: 'Art',
      date: '2026-05-30T09:00',
      location: 'Los Angeles, CA',
      capacity: 30,
      registered: 12,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '📷',
      price: 120
    },
    {
      id: 105,
      title: 'Startup Founders Summit 2026',
      description: 'Network with successful entrepreneurs, learn business model strategies, and get insights on securing investors. Panel discussions with industry leaders and fireside chats.',
      category: 'Business',
      date: '2026-06-12T13:00',
      location: 'New York City, NY',
      capacity: 200,
      registered: 147,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '💼',
      price: 0
    },
    {
      id: 106,
      title: 'Yoga & Mindfulness Retreat',
      description: 'Deep relaxation techniques, stress management, and guided meditation. Connect with your inner self in a peaceful environment. Bring your yoga mat.',
      category: 'Health',
      date: '2026-05-18T08:00',
      location: 'Austin, TX',
      capacity: 40,
      registered: 28,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🧘',
      price: 35
    },
    {
      id: 107,
      title: 'Python for Data Science',
      description: 'Comprehensive introduction to Python programming for data analysis. Cover NumPy, Pandas, and Matplotlib. Analyze real datasets and build your first predictive model.',
      category: 'Technology',
      date: '2026-06-20T11:00',
      location: 'Seattle, WA',
      capacity: 60,
      registered: 41,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '🐍',
      price: 89
    },
    {
      id: 108,
      title: 'Italian Cooking Masterclass',
      description: 'Learn authentic Italian cuisine from pasta-making to tiramisu. Hands-on kitchen experience with professional chefs. All ingredients provided. Food lovers welcome!',
      category: 'Food',
      date: '2026-06-08T17:00',
      location: 'Chicago, IL',
      capacity: 20,
      registered: 19,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🍝',
      price: 95
    },
    {
      id: 109,
      title: 'Digital Marketing & SEO Workshop',
      description: 'Master modern digital marketing strategies including SEO, social media campaigns, and content marketing. Practical tools and real case studies from top brands.',
      category: 'Business',
      date: '2026-07-10T10:00',
      location: 'Online (Zoom)',
      capacity: 150,
      registered: 87,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '📈',
      price: 29
    },
    {
      id: 110,
      title: 'Watercolor Painting for Beginners',
      description: 'Explore the beautiful world of watercolor art. Learn brush techniques, color mixing, and create your first landscape painting. All art supplies included.',
      category: 'Art',
      date: '2026-05-25T14:00',
      location: 'Portland, OR',
      capacity: 15,
      registered: 9,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🎨',
      price: 65
    },
    {
      id: 111,
      title: 'AI & Machine Learning Essentials',
      description: 'Understand the fundamentals of AI and ML. Learn about neural networks, build your first model with TensorFlow, and explore real-world applications of artificial intelligence.',
      category: 'Technology',
      date: '2026-07-05T13:00',
      location: 'Boston, MA',
      capacity: 100,
      registered: 78,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '🤖',
      price: 149
    },
    {
      id: 112,
      title: 'Public Speaking & Confidence Building',
      description: 'Overcome stage fright and deliver compelling presentations. Practice sessions with feedback, body language techniques, and storytelling frameworks used by top speakers.',
      category: 'Education',
      date: '2026-06-15T18:00',
      location: 'Online (Zoom)',
      capacity: 40,
      registered: 22,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🎤',
      price: 0
    },
    {
      id: 113,
      title: 'Morning Marathon Training',
      description: 'Weekly group training for upcoming marathon. Professional coach leading intervals, long runs, and recovery strategies. Suitable for intermediate to advanced runners.',
      category: 'Sports',
      date: '2026-05-20T06:30',
      location: 'Denver, CO',
      capacity: 35,
      registered: 20,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🏃',
      price: 25
    },
    {
      id: 114,
      title: 'Spanish Conversation Workshop',
      description: 'Practice conversational Spanish in small groups. Interactive exercises, cultural insights, and real-life scenarios. For intermediate learners looking to gain fluency.',
      category: 'Education',
      date: '2026-06-28T19:00',
      location: 'Miami, FL',
      capacity: 25,
      registered: 14,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '🗣️',
      price: 40
    },
    {
      id: 115,
      title: 'Jazz Night: Live Music & Improv',
      description: 'An intimate evening of live jazz performances and improvisation workshops. Musicians of all levels welcome to jam. Bring your instrument!',
      category: 'Music',
      date: '2026-07-18T20:00',
      location: 'New Orleans, LA',
      capacity: 60,
      registered: 38,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🎺',
      price: 20
    },
    {
      id: 116,
      title: 'Nutrition & Healthy Meal Planning',
      description: 'Learn how to plan nutritious meals for a healthier lifestyle. Covers macronutrients, portion control, and practical recipes. Nutritionist-led with Q&A session.',
      category: 'Health',
      date: '2026-06-22T11:00',
      location: 'Online (Zoom)',
      capacity: 100,
      registered: 63,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '🥗',
      price: 15
    },
    {
      id: 117,
      title: 'Rock Climbing for Beginners',
      description: 'Introduction to indoor rock climbing. Safety basics, climbing techniques, and guided climbs on beginner routes. All equipment provided by the climbing gym.',
      category: 'Sports',
      date: '2026-05-28T15:00',
      location: 'Salt Lake City, UT',
      capacity: 18,
      registered: 11,
      organizerId: 2,
      organizerName: 'Sarah Johnson',
      icon: '🧗',
      price: 55
    },
    {
      id: 118,
      title: 'Sushi Making Workshop',
      description: 'Master the art of sushi-making with a professional chef. Learn to prepare rice, roll maki, and create beautiful nigiri. Premium ingredients included.',
      category: 'Food',
      date: '2026-07-02T16:00',
      location: 'San Diego, CA',
      capacity: 16,
      registered: 16,
      organizerId: 1,
      organizerName: 'Admin User',
      icon: '🍣',
      price: 110
    }
  ];

  DB.set('users', sampleUsers);
  DB.set('events', sampleEvents);
  DB.set('registrations', []);
  localStorage.setItem('seeded_v2', 'true');
}

seedData();
