const request = require('supertest');
const app = require('../app');
const ItemController = require('../controllers/item');
const { Item } = require('../models');
const { v4: uuidv4 } = require('uuid');

jest.mock('../controllers/item');

async function getToken() {
  return await request(app).post("/api/users/login").send({
    email: "superadmin@i10e.dev",
    password: "teheperinko"
  }).then(res => res.body.data.token);
}

describe('CMS Items Routes', () => {
  let testItem;

  beforeAll(async () => {
    const categoryId = uuidv4();
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
    ItemController.getAllItems.mockClear();
    ItemController.getItemById.mockClear();
    ItemController.createItem.mockClear();
    ItemController.updateItem.mockClear();
    ItemController.deleteItem.mockClear();
  });

  test('GET /api/cms/items should call getAllItems', async () => {
    ItemController.getAllItems.mockImplementation((req, res) => res.status(200).send());

    const token = await getToken()
    await request(app).get('/api/items').set("Authorization", `Bearer ${token}`).expect(200);

    expect(ItemController.getAllItems).toHaveBeenCalled();
  });

  test('GET /api/cms/items/:id should call getItemById', async () => {
    ItemController.getItemById.mockImplementation((req, res) => res.status(200).send());

    const token = await getToken()
    await request(app).get(`/api/items/${testItem.id}`).set("Authorization", `Bearer ${token}`).expect(200);

    expect(ItemController.getItemById).toHaveBeenCalled();
  });

  test('GET /api/cms/items/:id should return 404 if item not found', async () => {
    ItemController.getItemById.mockImplementation((req, res) => res.status(404).send());

    const token = await getToken()
    await request(app).get(`/api/items/${uuidv4()}`).set("Authorization", `Bearer ${token}`).expect(404);

    expect(ItemController.getItemById).toHaveBeenCalled();
  });

  test('POST /api/cms/items should call createItem', async () => {
    ItemController.createItem.mockImplementation((req, res) => res.status(201).send());

    const token = await getToken()
    await request(app).post('/api/items').send({
      name: 'New Item',
      description: 'New Description',
      price: 200,
      categoryId: uuidv4(),
      quantity: 5,
      prescription: true,
    }).set("Authorization", `Bearer ${token}`).expect(201);

    expect(ItemController.createItem).toHaveBeenCalled();
  });

  test('PUT /api/cms/items/:id should call updateItem', async () => {
    ItemController.updateItem.mockImplementation((req, res) => res.status(200).send());

    const token = await getToken()
    await request(app).put(`/api/items/${testItem.id}`).send({
      name: 'Updated Item',
      description: 'Updated Description',
      price: 150,
    }).set("Authorization", `Bearer ${token}`).expect(200);

    expect(ItemController.updateItem).toHaveBeenCalled();
  });

  test('DELETE /api/cms/items/:id should call deleteItem', async () => {
    ItemController.deleteItem.mockImplementation((req, res) => res.status(200).send());

    const token = await getToken()
    await request(app).delete(`/api/items/${testItem.id}`).set("Authorization", `Bearer ${token}`).expect(200);

    expect(ItemController.deleteItem).toHaveBeenCalled();
  });
});
