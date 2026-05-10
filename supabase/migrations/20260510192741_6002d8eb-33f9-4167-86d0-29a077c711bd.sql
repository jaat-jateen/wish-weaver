
CREATE OR REPLACE FUNCTION public.validate_wish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF length(NEW.short_id) < 4 OR length(NEW.short_id) > 24 THEN
    RAISE EXCEPTION 'Invalid short_id length';
  END IF;
  IF length(NEW."from") < 1 OR length(NEW."from") > 80 THEN
    RAISE EXCEPTION 'Invalid from length';
  END IF;
  IF NEW."to" IS NOT NULL AND length(NEW."to") > 80 THEN
    RAISE EXCEPTION 'Invalid to length';
  END IF;
  IF length(NEW.message) < 1 OR length(NEW.message) > 1000 THEN
    RAISE EXCEPTION 'Invalid message length';
  END IF;
  IF length(NEW.festival) > 40 OR length(NEW.font) > 40 OR length(NEW.animation) > 40 THEN
    RAISE EXCEPTION 'Invalid preset value';
  END IF;
  IF NEW.music IS NOT NULL AND length(NEW.music) > 40 THEN
    RAISE EXCEPTION 'Invalid music value';
  END IF;
  IF NEW.text_color IS NOT NULL AND NEW.text_color NOT IN ('light','dark') THEN
    RAISE EXCEPTION 'Invalid text_color';
  END IF;
  IF NEW.bg_image IS NOT NULL AND length(NEW.bg_image) > 4000 THEN
    RAISE EXCEPTION 'Invalid bg_image length';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_wish_trigger
BEFORE INSERT ON public.wishes
FOR EACH ROW EXECUTE FUNCTION public.validate_wish();
