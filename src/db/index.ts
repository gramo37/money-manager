import mongoose from "mongoose";

export default function connectTodb(mongoURI: string | undefined) {
  if (!mongoURI) return console.log("Mongo URI not found", mongoURI);

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}
