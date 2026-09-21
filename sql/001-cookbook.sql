-- Keep the instructor's recipes table unchanged.
CREATE TABLE IF NOT EXISTS cookbook (
  visitor_id TEXT NOT NULL,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  notes TEXT NOT NULL DEFAULT '' CHECK (char_length(notes) <= 5000),
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (visitor_id, recipe_id)
);
