import { parse } from "csv-parse";
import { createReadStream } from "node:fs";

interface TransactionRow {
  date: string;
  type: string;
  amount: string;
  category: string;
  description: string;
}

export const parseCSV = (filePath: string): Promise<TransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const results: TransactionRow[] = [];

    createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }),
      )
      .on("data", (row: TransactionRow) => {
        results.push(row);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
