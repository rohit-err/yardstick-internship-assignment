
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Tenant = require("./models/tenant");
const User = require("./models/user");


const MONGODB_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

   
    const acme = await Tenant.create({ slug: "acme", name: "Acme Corp", plan: "free" });
    const globex = await Tenant.create({ slug: "globex", name: "Globex Inc", plan: "free" });

    console.log("Tenants created");

    
    const hashedPassword = await bcrypt.hash("password", 10);

    
    const users = [
      { email: "admin@acme.test", role: "admin", tenantId: acme._id, passwordHash: hashedPassword },
      { email: "user@acme.test", role: "member", tenantId: acme._id, passwordHash: hashedPassword },
      { email: "admin@globex.test", role: "admin", tenantId: globex._id, passwordHash: hashedPassword },
      { email: "user@globex.test", role: "member", tenantId: globex._id, passwordHash: hashedPassword },
    ];

    await User.insertMany(users);
    console.log("Users created");

    

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
