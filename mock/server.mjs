import { createServer } from 'node:http';

const FIRST = ['Olivia','Sara','Frank','Grace','Henry','Isabella','James','Katherine','Lucas','Emily','Christopher','Amanda'];
const LAST  = ['Mckinsey','Williams','Thompson','Lee','Adams','Martinez','Brown','White','Green','Davis','Miller','Garcia'];
const DEPT  = ['Sales','Customer Support','Sales','Customer Support','Sales','Support','Sales','Customer Support','Sales','Support','Sales','Customer Support'];
const CITY  = ['Chicago','Phoenix','Houston','Dallas','Seattle','Denver','Boston','Austin','Miami','Portland','Atlanta','Detroit'];
const TITLE = ['Sales Manager','Support Specialist','Account Executive','Sales Manager','Support Lead','Support Specialist','Sales Manager','Account Executive','Support Specialist','Sales Manager','Support Lead','Account Executive'];

const users = Array.from({length: 12}, (_, i) => ({
  id: i + 1,
  firstName: FIRST[i], lastName: LAST[i],
  email: `${FIRST[i].toLowerCase()}.${LAST[i].toLowerCase()}@gmail.com`,
  phone: `+1 (312) 555-01${String(10 + i).slice(-2)}`,
  image: '',
  company: { department: DEPT[i], name: 'Fit4Life', title: TITLE[i] },
  address: { city: CITY[i] },
}));

const BODIES = [
  "Hi, I recently joined Fit4Life and I'm trying to access my workout plan, but I can't login. Can you help?",
  "Hello Olivia 👋 I'm Michael, your AI customer support assistant. Let's fix this quickly. Could you confirm the email address?",
  "Yes, it's olivia.mckinsey@gmail.com",
  "Thanks! Looks like your reset wasn't completed. I've sent a new link - please check your inbox.",
  "I see it, resetting now...",
  "Done! I'm logged in. Thanks!",
  "Perfect 🎉 Your plan is ready under \"My Programs\". Since you're starting out, I suggest our Premium Guide - it boosts results and is 20% off here 👉 www.Fit4Life.com/Premium",
  "Oh my god 😍 I'll try it ASAP, thank you so much!!",
  "Good Evening, Emily! Hope you are well.",
  "Thank you for signing up Frank! If there is anything you need, let us know.",
  "I am sending you the report right away.",
  "Thank you for filling out our survey!",
];

const comments = Array.from({length: 340}, (_, i) => ({
  id: i + 1,
  body: BODIES[i % BODIES.length],
  postId: i, likes: (i * 7) % 19,
  user: { id: i, username: 'u' + i, fullName: 'User ' + i },
}));

// Minimal stand-in for dummyjson: same response shapes, Figma-matching copy.
createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const limit = Number(url.searchParams.get('limit') ?? 10);
  const skip = Number(url.searchParams.get('skip') ?? 0);
  res.setHeader('content-type', 'application/json');
  res.setHeader('access-control-allow-origin', '*');
  if (url.pathname === '/users') {
    res.end(JSON.stringify({ users: users.slice(skip, skip + limit), total: users.length, skip, limit }));
  } else if (url.pathname === '/comments') {
    res.end(JSON.stringify({ comments: comments.slice(skip, skip + limit), total: comments.length, skip, limit }));
  } else { res.statusCode = 404; res.end('{}'); }
}).listen(4100, () => console.log('mock on 4100'));
