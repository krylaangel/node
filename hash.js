const bcrypt = require("bcrypt");

bcrypt.hash("123456789", 10).then((hash) => {
  console.log("Hash:", hash);
});
