import "@testing-library/jest-dom";
import { config } from "dotenv";

config();

if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = <T>(val: T): T =>
    JSON.parse(JSON.stringify(val));
}
