import mongoose from "mongoose";
import { connectToMongoDB } from "./db/server.db.js";
import { app } from "./app.js";

connectToMongoDB()
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server listening on port: ${process.env.PORT}`);
    });

    server.on("error", (error) => {
      console.log(`EXPRESS APP ERROR :: ${error}`);
    });
  })
  .catch((error) => {
    console.log("DATABASE CONNECTION ERROR ::", error);
    process.exit(1);
  });
