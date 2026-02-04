import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('MONGO_URI is missing in .env');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@smartinventory.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin123*';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['ADMIN', 'CUSTOMER'], default: 'CUSTOMER' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'users' },
);

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI!);

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const exists = await User.findOne({ email });
  if (exists) {
    console.log(`Admin already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({ email, passwordHash, role: 'ADMIN', isActive: true });

  console.log(`✅ Admin created: ${email} / ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
}

seedAdmin().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
