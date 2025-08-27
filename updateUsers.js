const connectDB = require("./connect");

async function addFields() {
  const db = await connectDB();
  const result = await db
    .collection("users")
    .updateMany({}, { $set: { password: "", role: "user" } });
  console.log(result);
  process.exit();
}

addFields();
