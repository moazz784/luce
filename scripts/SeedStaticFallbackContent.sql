/*
  Seed script (partial): News, Events, and Gallery only.
  Hero, Syndicates, Awards, and Alumni are not seeded here — manage those in Admin or rely on
  client fallback (homeStaticFallback.js) when the API returns empty lists.

  Idempotency: each block runs only if that table has no rows.
  Adjust @BaseUrl to your production API origin (no trailing slash).

  Replace ImageUrl placeholders after uploading via Admin → media (News / Events / Gallery).
*/

SET NOCOUNT ON;

DECLARE @BaseUrl NVARCHAR(200) = N'https://luce.runasp.net';  -- TODO: set your API public URL
DECLARE @Now DATETIMEOFFSET = SYSDATETIMEOFFSET();

DECLARE @ImgNews1 NVARCHAR(2000) = @BaseUrl + N'/uploads/seed-m11.jpg';
DECLARE @ImgNews2 NVARCHAR(2000) = @BaseUrl + N'/uploads/seed-m22.jpg';
DECLARE @ImgNews3 NVARCHAR(2000) = @BaseUrl + N'/uploads/seed-m33.jpg';

DECLARE @ImgEv1 NVARCHAR(2000) = @BaseUrl + N'/uploads/seed-event-z11.jpg';
DECLARE @ImgEv2 NVARCHAR(2000) = @BaseUrl + N'/uploads/seed-event-z22.jpg';
DECLARE @ImgEv3 NVARCHAR(2000) = @BaseUrl + N'/uploads/seed-event-z33.jpg';
DECLARE @ImgEv4 NVARCHAR(2000) = @BaseUrl + N'/uploads/seed-event-z44.jpg';

/* ---------- NewsItems ---------- */
IF NOT EXISTS (SELECT 1 FROM NewsItems)
BEGIN
  INSERT INTO NewsItems (Title, Body, Location, ImageUrl, PublishedAt, SortOrder, IsPublished, CreatedAt, UpdatedAt)
  VALUES
  (N'Teaching Assistant applications (MUST)',
   N'Misr University for Science and Technology (MUST) is proud to announce the opening of applications for Teaching Assistant positions. We are looking for our top-performing graduates from the classes of 2022, 2023, and 2024 to join the Faculty of Information Technology and contribute to our academic excellence',
   NULL, @ImgNews1, @Now, 0, 1, @Now, NULL),
  (N'Faculty of IT — Teaching Assistant vacancies 2024-2025',
   N'The Faculty of Information Technology at Misr University for Science and Technology (MUST) is announcing vacancies for Teaching Assistant positions for the 2024-2025 class. We are seeking talented candidates in Computer Science, Information Systems, and Artificial Intelligence. Interested applicants should submit their documents to it.faculty@must.edu.eg before September 25, 2025',
   NULL, @ImgNews2, @Now, 1, 1, @Now, NULL),
  (N'Master''s Degree in Computer Science — applications open',
   N'Master''s Degree in Computer Science – Now Open for Applications! Join the Faculty of IT at MUST University for an intensive 18-month program (36 credit hours). Future-proof your career and apply today by scanning the QR code in the image!',
   NULL, @ImgNews3, @Now, 2, 1, @Now, NULL);
END

/* ---------- Events ---------- */
IF NOT EXISTS (SELECT 1 FROM Events)
BEGIN
  INSERT INTO Events (Title, EventDate, Location, TimeRange, Description, AccentColor, ImageUrl, SortOrder, CreatedAt, UpdatedAt)
  VALUES
  (N'College of Information Technology conference entitle...', '2026-11-06T12:00:00+00:00', N'Conference Hall', N'11:00 am - 5:00 pm',
   N'As inspirational as it gets! We couldn''t be more proud of our MUSTians sharing their success stories on the MUST stage.', N'#3b4b81', @ImgEv1, 0, @Now, NULL),
  (N'International Day for Women and Girls...', '2026-02-11T12:00:00+00:00', N'Conference Hall', N'10:00 am - 3:00 pm',
   N'Get ready to take in all the business slang and principles from the best in the field in the  "BUSINESS 101" panel discussion!', N'#3b4b81', @ImgEv2, 1, @Now, NULL),
  (N'MUST Winter Festival', '2026-12-11T12:00:00+00:00', N'MUST Golf Garden', N'10:00 am - 7:00 pm',
   N'Ready to revive cozy winter nights? How''s that...slang and principles from the best in the field in the songs', N'#3b4b81', @ImgEv3, 2, @Now, NULL),
  (N'MUST Cultural Day', '2026-02-23T12:00:00+00:00', N'Conference Hall', N'10:00 am - 5:00 pm',
   N'Snippets from the "AI and Digital Transformation" panel, as industry leaders discuss how AI is reshaping the landscape of digital transformation and its impact on business strategies.', N'#00a651', @ImgEv4, 3, @Now, NULL);
END

/* ---------- GalleryItems ---------- */
IF NOT EXISTS (SELECT 1 FROM GalleryItems)
BEGIN
  INSERT INTO GalleryItems (Year, ImageUrl, SortOrder, CreatedAt, UpdatedAt)
  VALUES
  (2026, @BaseUrl + N'/uploads/seed-gallery-1.jpg', 0, @Now, NULL),
  (2026, @BaseUrl + N'/uploads/seed-gallery-2.jpg', 1, @Now, NULL),
  (2025, @BaseUrl + N'/uploads/seed-gallery-3.jpg', 0, @Now, NULL);
END

PRINT N'SeedStaticFallbackContent.sql finished (News, Events, Gallery only). Replace @BaseUrl and upload seed-*.jpg or set real ImageUrls.';
