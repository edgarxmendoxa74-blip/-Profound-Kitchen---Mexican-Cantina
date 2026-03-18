-- Add Events settings to site_settings table
INSERT INTO site_settings (id, value, type, description) VALUES
  ('events_title', 'Host Your <br />\n<span class="text-brand-violet italic">Grand Event.</span>', 'text', 'Main title for the Events section. Supports HTML for styling.'),
  ('events_subtitle', 'Private Gatherings', 'text', 'Small overhead subtitle for the Events section'),
  ('events_description', 'From intimate celebrations to grand corporate gatherings, Profound + Kitchen provides the perfect backdrop of vibrant Mexican culture and sophisticated elegance.', 'text', 'Description paragraph for the Events section'),
  ('events_policies', '[{"title": "Reservation Lead Time", "desc": "Please inquire at least 2 weeks before your desired date."}, {"title": "Menu Customization", "desc": "The maximum capacity is 28pax and the set menu is 10 pax above."}, {"title": "Downpayment", "desc": "A 50% non-refundable downpayment is required to secure the date."}, {"title": "Cancellation", "desc": "Cancellations must be made at least 7 days in advance."}]', 'text', 'JSON array of Event Policies.')
ON CONFLICT (id) DO UPDATE SET 
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  description = EXCLUDED.description;
