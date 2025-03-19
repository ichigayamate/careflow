const {GoogleGenerativeAI} = require("@google/generative-ai");
const {generateResponse} = require("../../views/response-entity");

module.exports = {
  async generateAnswer(req, res, next) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      apiKey: process.env.GEMINI_API_KEY,
    });

    try {
      const {question} = req.body;
      const prompt = `Generate only 1 product description for "${question}" and make it attractive to buyers. Generate without a response like "okay, here are...."`
      const response = await genAI.generateContent(prompt);

      const answer = response.response.candidates[0].content.parts[0].text
      generateResponse(res, answer);
    } catch (err) {
      next(err)
    }
  }
}
