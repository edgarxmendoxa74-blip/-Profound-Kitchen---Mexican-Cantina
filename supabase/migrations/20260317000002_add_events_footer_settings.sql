-- Add remaining events footer settings to site_settings table
INSERT INTO site_settings (id, value, type, description) VALUES
  ('events_quote', '"We make every celebration a profound experience."', 'text', 'The quoted text shown at the bottom of the Events policies section'),
  ('events_form_title', 'Official PAX Form', 'text', 'The title above the form link button in Events section'),
  ('events_form_link_text', 'Access Google Form', 'text', 'The text inside the form link button in Events section')
ON CONFLICT (id) DO NOTHING;
