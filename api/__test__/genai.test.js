const request = require('supertest');
const app = require('../app');
const genAIcontroller = require('../controllers/public/gen-ai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

jest.mock('@google/generative-ai');

describe('POST /generate-description', () => {
  let token;

  beforeAll(async () => {
    token = await request(app).post("/api/users/login").send({
      email: "superadmin@i10e.dev",
      password: "teheperinko"
    }).then(res => res.body.data.token);
  });

  it('should generate a product description', async () => {
    const mockResponse = {
      response: {
        candidates: [
          {
            content: {
              parts: [
                { text: "This is a generated product description." }
              ]
            }
          }
        ]
      }
    };

    GoogleGenerativeAI.prototype.getGenerativeModel.mockReturnValue({
      generateContent: jest.fn().mockResolvedValue(mockResponse)
    });

    const res = await request(app)
      .post('/api/items/generate-description')
      .send({ question: 'Test Product' })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.data).toBe("This is a generated product description.");
  });

  it('should handle unauthorized', async () => {
    const res = await request(app)
      .post('/api/items/generate-description')
      .send({ question: 'Test Product' })
      .expect(401);

    expect(res.status).toBe(401);
  });
});
