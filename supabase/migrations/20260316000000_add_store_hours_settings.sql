-- Add store hours settings to site_settings table
INSERT INTO site_settings (id, value, type, description) VALUES
  ('store_hours_summary', 'TUES - SUN • 11:00 AM - 10:00 PM', 'text', 'Summary of store hours shown in the header top bar'),
  ('store_hours', '[{"label": "Monday", "hours": "2:00 PM – 10:00 PM"}, {"label": "Tue - Thu & Sun", "hours": "11:30 AM – 10:00 PM"}, {"label": "Fri - Sat", "hours": "11:30 AM – 11:00 PM"}]', 'text', 'Detailed store hours schedule in JSON format')
ON CONFLICT (id) DO UPDATE SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;
