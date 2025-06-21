import { Server } from "http";
import app from "./app";

let server: Server;

const PORT = 5000;

async function main() {
  try {
    server = app.listen(PORT, () => {
      console.log(`Library management app is running🏃🏼‍♂️ on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();
