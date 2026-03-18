-- Add remaining Events settings and new Location settings to site_settings table
INSERT INTO site_settings (id, value, type, description) VALUES
  -- Remaining Events Info
  ('events_feature1_title', 'Flexible PAX', 'text', 'Title for the first event feature'),
  ('events_feature1_desc', 'Customizable seating arrangements for any group size.', 'text', 'Description for the first event feature'),
  ('events_feature2_title', 'Safe & Private', 'text', 'Title for the second event feature'),
  ('events_feature2_desc', 'Dedicated event spaces with strict safety protocols.', 'text', 'Description for the second event feature'),
  ('events_button_text', 'Inquire Now', 'text', 'Text for the main event CTA button'),
  ('events_button_url', 'https://forms.gle/B4hsT2YbFSTEAtkH8', 'text', 'URL for the main event CTA button'),

  -- Location Info
  ('location_subtitle', 'Find Your Sanctuary', 'text', 'Small subtitle overhead the Location section'),
  ('location_title', 'Visit Our <br />\n<span class="text-brand-violet italic">Kitchen.</span>', 'text', 'Main title for the Location section. Supports HTML for styling.'),
  ('location_address', 'Profound + Kitchen<br />26-B Sct Borromeo, South Triangle, Quezon City', 'text', 'Store Address text. Supports HTML.'),
  ('location_phone', '09062066175', 'text', 'Contact Phone Number / Viber'),
  ('location_map_title', 'Interactive Map', 'text', 'Title above the map description'),
  ('location_map_desc', 'Located in the heart of South Triangle''s culinary district.', 'text', 'Description text next to map block'),
  ('location_button_text', 'Get Directions', 'text', 'Text for the map directions button'),
  ('location_button_url', 'https://maps.app.goo.gl/9ZQXQXQXQXQXQXQX9', 'text', 'URL for the map directions button')
ON CONFLICT (id) DO UPDATE SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;
