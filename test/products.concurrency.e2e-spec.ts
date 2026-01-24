import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products Concurrency (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not oversell stock under concurrent decrements', async () => {
    // 1) Crear producto con stock 1
    const createRes = await request(app.getHttpServer())
      .post('/products')
      .send({
        sku: `SKU-CONC-${Date.now()}`,
        name: 'Producto Concurrencia',
        description: 'test',
        price: 100,
        stock: 1,
      })
      .expect(201);

    const productId = createRes.body.id ?? createRes.body._id;

    // 2) Disparar 20 requests en paralelo (qty=1)
    const N = 20;
    const results = await Promise.all(
      Array.from({ length: N }).map(() =>
        request(app.getHttpServer())
          .post(`/products/${productId}/decrement-stock`)
          .send({ qty: 1 }),
      ),
    );

    const ok = results.filter(r => r.status === 201 || r.status === 200);
    const conflict = results.filter(r => r.status === 409);

    // 3) Esperamos 1 éxito y 19 conflictos
    expect(ok.length).toBe(1);
    expect(conflict.length).toBe(N - 1);

    // 4) Stock final debe ser 0
    const getRes = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(getRes.body.stock).toBe(0);
  });
});
