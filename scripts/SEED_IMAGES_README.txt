SQL seed: News, Events, and Gallery only
=========================================

This project seeds only NewsItems, Events, and GalleryItems in SeedStaticFallbackContent.sql.
Hero slides, syndicates, awards, and alumni are not included — enter those through the
Admin dashboard or use the built-in static fallback in src/homeStaticFallback.js when lists are empty.

1. Deploy the API and open Admin Dashboard (Admin role).

2. Upload images via POST /api/admin/media (same flow as when creating News/Events/Gallery items).

3. Copy the returned JSON "url" and paste into the SQL script, or upload files as seed-m11.jpg,
   seed-event-z11.jpg, seed-gallery-1.jpg, etc. under wwwroot/uploads to match the placeholders.

4. Set @BaseUrl in the script to your API public origin (no trailing slash).

5. Run the SQL on SQL Server after migrations. Tables use IF NOT EXISTS (empty table) guards.
