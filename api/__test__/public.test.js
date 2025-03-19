const request = require('supertest');
const app = require('../app');
const ItemsController = require('../controllers/public/item');
const { Item } = require('../models');

jest.mock('../controllers/public/item');

describe('Public Items Routes', () => {
  let testItem;

  beforeAll(async () => {
    testItem = await Item.create({
      name: 'Test Item',
      description: 'Test Description',
      price: 100,
      category: "3e01a06a-8469-409d-ab62-028cab9cee37",
      quantity: 10,
      prescription: false,
    });
  });

  afterAll(async () => {
    await Item.destroy({ where: { id: testItem.id } });
  });

  beforeEach(() => {
    ItemsController.getPublicItems.mockClear();
    ItemsController.getPublicItemById.mockClear();
  });

  test('GET /api/public/items should call getPublicItems', async () => {
    await request(app).get('/api/public/items').expect(200);
  });

  test('GET /api/public/items/:id should call getPublicItemById', async () => {
    await request(app).get(`/api/public/items/${testItem.id}`).expect(200);
  });
});
