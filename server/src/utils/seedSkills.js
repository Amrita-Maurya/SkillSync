const mongoose = require('mongoose');
const dns = require('dns');
const Skill = require('../models/Skill');
require('dotenv').config();

dns.setServers(['8.8.8.8', '1.1.1.1']);

// ─── MASTER SKILL LIST ─────────────────────────────────────
const skills = [
  // Web Development
  { name: 'HTML & CSS', category: 'WebDev', slug: 'html-css', description: 'Building and styling web pages' },
  { name: 'JavaScript', category: 'WebDev', slug: 'javascript', description: 'Core language of the web' },
  { name: 'React', category: 'WebDev', slug: 'react', description: 'UI library by Meta' },
  { name: 'Node.js', category: 'WebDev', slug: 'nodejs', description: 'JavaScript runtime for backend' },
  { name: 'Express.js', category: 'WebDev', slug: 'expressjs', description: 'Web framework for Node.js' },
  { name: 'MongoDB', category: 'WebDev', slug: 'mongodb', description: 'NoSQL document database' },
  { name: 'TypeScript', category: 'WebDev', slug: 'typescript', description: 'Typed superset of JavaScript' },
  { name: 'Next.js', category: 'WebDev', slug: 'nextjs', description: 'React framework for production' },
  { name: 'GraphQL', category: 'WebDev', slug: 'graphql', description: 'Query language for APIs' },
  { name: 'REST API Design', category: 'WebDev', slug: 'rest-api', description: 'Designing RESTful APIs' },

  // DSA
  { name: 'Arrays & Strings', category: 'DSA', slug: 'arrays-strings', description: 'Fundamental data structures' },
  { name: 'Linked Lists', category: 'DSA', slug: 'linked-lists', description: 'Linear data structures' },
  { name: 'Stacks & Queues', category: 'DSA', slug: 'stacks-queues', description: 'LIFO and FIFO structures' },
  { name: 'Trees & Graphs', category: 'DSA', slug: 'trees-graphs', description: 'Hierarchical and network structures' },
  { name: 'Dynamic Programming', category: 'DSA', slug: 'dynamic-programming', description: 'Optimization technique' },
  { name: 'Sorting & Searching', category: 'DSA', slug: 'sorting-searching', description: 'Fundamental algorithms' },
  { name: 'Recursion & Backtracking', category: 'DSA', slug: 'recursion-backtracking', description: 'Problem solving techniques' },
  { name: 'Greedy Algorithms', category: 'DSA', slug: 'greedy', description: 'Locally optimal choices' },
  { name: 'Bit Manipulation', category: 'DSA', slug: 'bit-manipulation', description: 'Binary operations' },
  { name: 'Segment Trees', category: 'DSA', slug: 'segment-trees', description: 'Range query data structure' },

  // Machine Learning
  { name: 'Python', category: 'ML', slug: 'python', description: 'Primary language for ML' },
  { name: 'NumPy & Pandas', category: 'ML', slug: 'numpy-pandas', description: 'Data manipulation libraries' },
  { name: 'Machine Learning Basics', category: 'ML', slug: 'ml-basics', description: 'Supervised and unsupervised learning' },
  { name: 'Deep Learning', category: 'ML', slug: 'deep-learning', description: 'Neural networks and beyond' },
  { name: 'Natural Language Processing', category: 'ML', slug: 'nlp', description: 'Processing human language' },
  { name: 'Computer Vision', category: 'ML', slug: 'computer-vision', description: 'Image and video analysis' },
  { name: 'Scikit-Learn', category: 'ML', slug: 'scikit-learn', description: 'ML library for Python' },
  { name: 'TensorFlow', category: 'ML', slug: 'tensorflow', description: 'Deep learning framework by Google' },
  { name: 'Data Visualization', category: 'ML', slug: 'data-visualization', description: 'Charts, plots, and dashboards' },

  // Design
  { name: 'Figma', category: 'Design', slug: 'figma', description: 'UI/UX design tool' },
  { name: 'UI Design Principles', category: 'Design', slug: 'ui-design', description: 'Visual design fundamentals' },
  { name: 'UX Research', category: 'Design', slug: 'ux-research', description: 'User research and testing' },
  { name: 'Responsive Design', category: 'Design', slug: 'responsive-design', description: 'Mobile-first design approach' },
  { name: 'Design Systems', category: 'Design', slug: 'design-systems', description: 'Component libraries and style guides' },
  { name: 'Tailwind CSS', category: 'Design', slug: 'tailwind-css', description: 'Utility-first CSS framework' },

  // DevOps
  { name: 'Git & GitHub', category: 'DevOps', slug: 'git-github', description: 'Version control and collaboration' },
  { name: 'Linux & Shell', category: 'DevOps', slug: 'linux-shell', description: 'Command line and scripting' },
  { name: 'Docker', category: 'DevOps', slug: 'docker', description: 'Containerization platform' },
  { name: 'CI/CD Pipelines', category: 'DevOps', slug: 'cicd', description: 'Automated build and deployment' },
  { name: 'AWS Basics', category: 'DevOps', slug: 'aws-basics', description: 'Cloud computing fundamentals' },
  { name: 'System Design', category: 'DevOps', slug: 'system-design', description: 'Designing scalable systems' },
  { name: 'Networking Basics', category: 'DevOps', slug: 'networking', description: 'HTTP, DNS, TCP/IP fundamentals' },

  // Mobile
  { name: 'React Native', category: 'Mobile', slug: 'react-native', description: 'Cross-platform mobile development' },
  { name: 'Flutter', category: 'Mobile', slug: 'flutter', description: 'Google UI toolkit for mobile' },
  { name: 'Android Development', category: 'Mobile', slug: 'android', description: 'Native Android with Kotlin/Java' },
  { name: 'iOS Development', category: 'Mobile', slug: 'ios', description: 'Native iOS with Swift' },
  { name: 'Mobile UI Design', category: 'Mobile', slug: 'mobile-ui', description: 'Designing for small screens' },
];

// ─── SEED FUNCTION ─────────────────────────────────────────
const seedSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    let inserted = 0;
    let updated = 0;

    for (const skill of skills) {
      const result = await Skill.updateOne(
        { slug: skill.slug },
        { $set: skill },
        { upsert: true }
      );

      if (result.upsertedCount > 0) inserted++;
      else if (result.modifiedCount > 0) updated++;
    }

    console.log(`Seeding complete.`);
    console.log(`Inserted: ${inserted} new skills`);
    console.log(`Updated: ${updated} existing skills`);
    console.log(`Total skills in list: ${skills.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedSkills();