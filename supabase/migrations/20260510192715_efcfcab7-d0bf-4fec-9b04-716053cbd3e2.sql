
CREATE TABLE public.wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id text NOT NULL UNIQUE,
  "from" text NOT NULL,
  "to" text,
  message text NOT NULL,
  festival text NOT NULL,
  font text NOT NULL,
  animation text NOT NULL,
  music text,
  text_color text,
  bg_image text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX wishes_short_id_idx ON public.wishes(short_id);

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create wishes"
  ON public.wishes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view wishes"
  ON public.wishes FOR SELECT
  TO anon, authenticated
  USING (true);
