import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('MONGO_URI is missing in .env');

const uri: string = MONGO_URI;

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: 'products' },
);

// 👇 Un solo text index multi-campo (recuerda: Mongo solo permite 1 text index por colección)
productSchema.index({ sku: 'text', name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

function pad(n: number, width: number) {
  return n.toString().padStart(width, '0');
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);

  // Opcional: si quieres reiniciar datos antes de seedear
  // await Product.deleteMany({});

  const total = 500;
  const batchSize = 10;

  console.log(`Seeding ${total} products in batches of ${batchSize}...`);

  for (let i = 1; i <= total; i += batchSize) {
    const batch: any[] = [];
    const end = Math.min(i + batchSize - 1, total);

    for (let k = i; k <= end; k++) {
      const sku = `SKU-${pad(k, 5)}`; 

      batch.push({
        sku,
        name: `Producto ${pad(k, 5)}`,
        description: `Descripción del producto ${pad(k, 5)} - categoría ${randomInt(1, 25)}`,
        price: Number((randomInt(10, 1000) + Math.random()).toFixed(2)),
        stock: randomInt(0, 200),
      });
    }

    try {
      // ordered:false => si algún SKU choca, no se cae todo el lote
      await Product.insertMany(batch, { ordered: false });
    } catch (err: any) {
      // En caso de duplicados E11000 u otros, continuamos
      console.error('Batch insert warning:', err?.message ?? err);
    }

    if ((end % 5000) === 0) console.log(`Inserted up to ${end}/${total}`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

seed().catch(async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
