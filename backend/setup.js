const fs = require('fs');
const path = require('path');

const dirs = ['models', 'routes', 'controllers', 'middleware'];
dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

fs.writeFileSync(path.join(__dirname, 'models/User.js'), 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
);

fs.writeFileSync(path.join(__dirname, 'models/Product.js'), 
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  images: [{ type: String }],
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
);

fs.writeFileSync(path.join(__dirname, 'models/Category.js'), 
const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Category', CategorySchema);
);

fs.writeFileSync(path.join(__dirname, 'models/Brand.js'), 
const mongoose = require('mongoose');
const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Brand', BrandSchema);
);

fs.writeFileSync(path.join(__dirname, 'routes/auth.js'), 
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
});

router.get('/profile', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
});
module.exports = router;
);

fs.writeFileSync(path.join(__dirname, 'routes/products.js'), 
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name').populate('brand', 'name');
    res.json({ products });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name').populate('brand', 'name');
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { res.status(500).json({ message: error.message }); }
});
module.exports = router;
);

fs.writeFileSync(path.join(__dirname, 'routes/categories.js'), 
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) { res.status(500).json({ message: error.message }); }
});
module.exports = router;
);

fs.writeFileSync(path.join(__dirname, 'routes/brands.js'), 
const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) { res.status(500).json({ message: error.message }); }
});
module.exports = router;
);

fs.writeFileSync(path.join(__dirname, 'server.js'), 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log('Server running on port ' + PORT);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
);
