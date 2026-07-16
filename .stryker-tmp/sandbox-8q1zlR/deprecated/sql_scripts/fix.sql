CREATE OR REPLACE FUNCTION public.init_user_risk_score()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_risk_scores (user_id, risk_score, flags)
  VALUES (NEW.id, 0, '{}'::jsonb)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;
