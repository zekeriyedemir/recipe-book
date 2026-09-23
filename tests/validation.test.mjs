import test from "node:test";
import assert from "node:assert/strict";
import { parseRecipeId, isValidNotes, normalizeSearch, escapeLike } from "../src/utils/validation.ts";

test("recipe IDs accept only positive PostgreSQL integers", () => {
  for (const value of [1, "43", "2147483647"]) assert.equal(parseRecipeId(value), Number(value));
  for (const value of [null, undefined, {}, [], true, 0, -1, "1.2", "1e2", "1 OR 1=1", " 1", "01", "2147483648", Infinity]) {
    assert.equal(parseRecipeId(value), null);
  }
});

test("notes allow clearing and Unicode but reject invalid or oversized input", () => {
  for (const value of ["", "Try more garlic 🧄", "x".repeat(5000)]) assert.equal(isValidNotes(value), true);
  for (const value of [null, 42, [], {}, "x".repeat(5001), "bad\0note"]) assert.equal(isValidNotes(value), false);
});

test("search normalizes input and treats SQL LIKE wildcards literally", () => {
  assert.equal(normalizeSearch("  Italian  "), "Italian");
  assert.equal(normalizeSearch(undefined), "");
  assert.equal(normalizeSearch("x".repeat(201)).length, 200);
  assert.equal(normalizeSearch("a\0b"), "ab");
  assert.equal(escapeLike("100%_\\"), "100\\%\\_\\\\");
});
