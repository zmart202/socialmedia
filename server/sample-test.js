const shortid = require("shortid");

module.exports = {
  name: "Customer Service",
  id: shortid.generate(),
  questions: [
    {
      id: shortid(),
      body: "question 1",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: shortid.generate(), answer: "some answer", correct: false },
        { id: shortid.generate(), answer: "another answer", correct: false },
        { id: shortid.generate(), answer: "the right answer", correct: true },
        { id: shortid.generate(), answer: "bleh", correct: false }
      ]
    },
    {
      id: shortid.generate(),
      body: "question 2",
      type: "OPEN_RESPONSE"
    }
  ]
};
