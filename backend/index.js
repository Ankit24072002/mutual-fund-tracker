require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();

// ✅ Allow requests only from your FRONTEND Render URL
app.use(cors({
  origin: ["https://mutual-fund-tracker-2-iqzm.onrender.com"], // ✅ FRONTEND URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(helmet());
app.use(express.json());

// ✅ Config
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mf_tracker';
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || 3600);

// ✅ Cache
const cache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 120 });

// ✅ MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  savedSchemes: [Number]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ✅ Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth header' });

  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ✅ Helper: Fetch Mutual Fund API with caching
async function fetchMfApi(path) {
  const base = 'https://api.mfapi.in';
  const url = base + path;
  const cached = cache.get(url);
  if (cached) return cached;

  const res = await axios.get(url, { timeout: 10000 });
  cache.set(url, res.data);
  return res.data;
}

// ✅ Routes
app.get('/', (req, res) => res.send('Server running'));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, savedSchemes: [] });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/saved', authMiddleware, async (req, res) => {
  try {
    const { schemeCode } = req.body;
    if (!schemeCode) return res.status(400).json({ error: 'schemeCode required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.savedSchemes.includes(schemeCode)) {
      user.savedSchemes.push(schemeCode);
      await user.save();
    }

    res.json({ savedSchemes: user.savedSchemes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/saved/:schemeCode', authMiddleware, async (req, res) => {
  try {
    const code = Number(req.params.schemeCode);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.savedSchemes = user.savedSchemes.filter(s => s !== code);
    await user.save();

    res.json({ savedSchemes: user.savedSchemes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ savedSchemes: user.savedSchemes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/mf/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const data = await fetchMfApi('/mf/search?q=' + encodeURIComponent(q));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'External API error' });
  }
});

app.get('/api/mf/:schemeCode', async (req, res) => {
  try {
    const code = req.params.schemeCode;
    const data = await fetchMfApi('/mf/' + encodeURIComponent(code));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'External API error' });
  }
});

app.post('/api/mf/compare', async (req, res) => {
  try {
    const { schemeCodes } = req.body;
    if (!Array.isArray(schemeCodes)) return res.status(400).json({ error: 'schemeCodes array required' });

    const results = await Promise.all(
      schemeCodes.map(code => fetchMfApi('/mf/' + encodeURIComponent(code)))
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'External API error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
