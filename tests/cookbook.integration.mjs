import test from "node:test";
import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL;
if (!base) throw new Error("Set TEST_BASE_URL to a running local Recipe Book server.");
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Integration tests must target a local server.");

test("recipe browsing and isolated cookbook CRUD against Neon", async (t) => {
  let cookie = "";
  const recipeId = Number(process.env.TEST_RECIPE_ID ?? 1);
  const call = (path, method = "GET", body, ownCookie = cookie, extraHeaders = {}) => fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Cookbook-Request": "1", ...(ownCookie ? { Cookie: ownCookie } : {}), ...extraHeaders },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const list = async (ownCookie = cookie) => {
    const response = await call("/api/cookbook", "GET", undefined, ownCookie);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control"), /no-store/);
    return response.json();
  };
  try {
    await t.test("detail, search, empty results and missing pages", async () => {
      const apiDetail = await call(`/api/recipes/${recipeId}`);
      assert.equal(apiDetail.status, 200);
      const recipe = await apiDetail.json();
      assert.equal(recipe.id, recipeId);
      assert.ok(Array.isArray(recipe.ingredients));
      const apiSearch = await call(`/api/recipes?q=${encodeURIComponent(recipe.title)}`);
      assert.equal(apiSearch.status, 200);
      assert.ok((await apiSearch.json()).some((row) => row.id === recipeId));
      assert.equal((await call('/api/recipes/2147483647')).status, 404);
      assert.equal((await call('/api/recipes/invalid')).status, 400);
      const detail = await call(`/recipes/${recipeId}`);
      assert.equal(detail.status, 200);
      assert.match(await detail.text(), /Ingredients/);
      const search = await call("/?q=carbonara");
      assert.match(await search.text(), /Spaghetti Carbonara/);
      const category = await call("/?q=ITALIAN");
      assert.match(await category.text(), /Spaghetti Carbonara/);
      for (const q of ["zzzz-no-matching-recipe", "%", "' OR 1=1 --"]) {
        assert.match(await (await call(`/?q=${encodeURIComponent(q)}`)).text(), /No recipes found/);
      }
      for (const id of ["invalid", "2147483647", "0", "2147483648"]) {
        const missingPage = await (await call(`/recipes/${id}`)).text();
        assert.match(missingPage, /Recipe not found/);
        assert.match(missingPage, /<meta name="robots" content="noindex"/);
      }
    });
    await t.test("invalid writes and cross-origin requests are rejected", async () => {
      assert.deepEqual(await list(), []);
      for (const recipeId of [0, -1, "1 OR 1=1", null, 2147483648]) {
        assert.equal((await call("/api/cookbook", "POST", { recipeId })).status, 400);
      }
      assert.equal((await call("/api/cookbook", "POST", { recipeId }, "", { Origin: "https://example.com" })).status, 403);
      assert.equal((await call("/api/cookbook", "POST", { recipeId }, "", { "X-Cookbook-Request": "" })).status, 403);
      assert.equal((await call("/api/cookbook", "POST", { recipeId: 2147483647 })).status, 404);
      const malformed = await fetch(`${base}/api/cookbook`, { method: "POST", headers: { "Content-Type": "application/json", "X-Cookbook-Request": "1" }, body: "{" });
      assert.equal(malformed.status, 400);
    });
    await t.test("save establishes a protected cookie and persists the recipe", async () => {
      const saved = await call("/api/cookbook", "POST", { recipeId });
      assert.equal(saved.status, 200);
      const setCookie = saved.headers.get("set-cookie");
      assert.ok(setCookie);
      cookie = setCookie.split(";")[0];
      assert.match(setCookie, /httponly/i);
      assert.match(setCookie, /samesite=lax/i);
      const rows = await list();
      assert.equal(rows.length, 1);
      assert.equal(rows[0].id, recipeId);
      assert.equal(rows[0].notes, "");
      assert.equal("visitor_id" in rows[0], false);
    });
    await t.test("notes persist, duplicate saves preserve them, and notes can be cleared", async () => {
      const path = `/api/cookbook/${recipeId}`;
      const notes = "Use extra garlic 🧄 and a pinch of salt.";
      assert.equal((await call(path, "PATCH", { notes })).status, 200);
      assert.equal((await call("/api/cookbook", "POST", { recipeId })).status, 200);
      assert.equal((await list()).length, 1);
      assert.equal((await list())[0].notes, notes);
      for (const notes of [null, 42, "x".repeat(5001), "bad\0note"]) {
        assert.equal((await call(path, "PATCH", { notes })).status, 400);
      }
      assert.equal((await list())[0].notes, notes);
      assert.equal((await call(path, "PATCH", { notes: "" })).status, 200);
      assert.equal((await list())[0].notes, "");
    });
    await t.test("another visitor cannot read, update or remove this cookbook", async () => {
      for (const stranger of ["", "recipe-book-visitor=invalid", `recipe-book-visitor=${"a".repeat(64)}`]) {
        assert.deepEqual(await list(stranger), []);
        assert.equal((await call(`/api/cookbook/${recipeId}`, "PATCH", { notes: "overwrite" }, stranger)).status, 404);
        assert.equal((await call(`/api/cookbook/${recipeId}`, "DELETE", undefined, stranger)).status, 404);
      }
      assert.equal((await list()).length, 1);
    });
    await t.test("remove persists and missing entries return 404", async () => {
      assert.equal((await call(`/api/cookbook/${recipeId}`, "DELETE")).status, 200);
      assert.deepEqual(await list(), []);
      assert.equal((await call(`/api/cookbook/${recipeId}`, "DELETE")).status, 404);
      assert.equal((await call(`/api/cookbook/${recipeId}`, "PATCH", { notes: "gone" })).status, 404);
    });
  } finally {
    // Only this test visitor's saved entry is removed; instructor recipes are untouched.
    if (cookie) await call(`/api/cookbook/${recipeId}`, "DELETE");
  }
});
