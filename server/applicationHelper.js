const hat = require("hat");

const applicationHelper = async (req, res) => {
  // console.log("Hello");
  try {
    const db = await req.app.locals.db;
    const Applicants = await db.collection("applicants");
    const Jobs = await db.collection("jobs");
    const { companyId, jobId } = req.body;
    const applicantId = hat();

    const jobData = await Jobs.findOne({ companyId, id: jobId });
    const result = await Applicants.insertOne({
      ...req.body,
      jobData,
      id: applicantId,
      completed: false,
      timestamp: new Date(),
      testTimestamp: null,
      secondsElapsed: 0,
      answers: null
    });
    // console.log("Data object", result);
    let finalResult = {
      ...req.body,
      applicantId,
      jobData,
      success: true
    };
    res.status(200).send(finalResult);
  } catch (err) {
    console.log("Error from applicationHelper -", err);
  }
};

module.exports = applicationHelper;
