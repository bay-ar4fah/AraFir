import sqlite3 from "sqlite3";

export const db =
  new sqlite3.Database(
    "./cases/arafir.db",
    (err) => {

      if (err) {

        console.error(
          err.message
        );

        return;
      }

      console.log(
        "SQLite Connected"
      );

    }
  );