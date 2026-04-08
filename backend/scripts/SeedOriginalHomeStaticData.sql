/*
  Seed data migrated from the original static arrays in src/Home.jsx (before API wiring).
  Source revision: git show 0e2b5be:src/Home.jsx

  Target: SQL Server (schema from EF migrations).

  Before running:
  1. Apply EF migrations so tables exist.
  2. Image URLs: copy the referenced files from frontend src/assets into your deployed site
     under public/images/seed/ (same filenames as below), OR upload via Admin and replace URLs.
  3. Optionally set @ImageBaseUrl to your SPA origin (no trailing slash), e.g. N'https://your-app.vercel.app'
     If left empty, URLs are relative (/images/seed/...).

  Optional: uncomment the DELETE block to clear existing content tables first (destructive).
*/

SET NOCOUNT ON;

DECLARE @ImageBaseUrl NVARCHAR(500) = N''; -- e.g. N'https://your-spa.example.com'

DECLARE @Now DATETIMEOFFSET = SYSDATETIMEOFFSET();

/*
-- UNCOMMENT ONLY IF YOU WANT TO WIPE AND RESEED (destructive)
DELETE FROM SyndicateCards;
DELETE FROM HeroSlides;
DELETE FROM Alumni;
DELETE FROM Awards;
DELETE FROM Events;
DELETE FROM NewsItems;
DBCC CHECKIDENT ('SyndicateCards', RESEED, 0);
DBCC CHECKIDENT ('HeroSlides', RESEED, 0);
DBCC CHECKIDENT ('Alumni', RESEED, 0);
DBCC CHECKIDENT ('Awards', RESEED, 0);
DBCC CHECKIDENT ('Events', RESEED, 0);
DBCC CHECKIDENT ('NewsItems', RESEED, 0);
*/

BEGIN TRANSACTION;

/* ---------- NewsItems ---------- */
INSERT INTO NewsItems (Title, Body, ImageUrl, PublishedAt, SortOrder, IsPublished, CreatedAt, UpdatedAt)
VALUES
(
  N'Misr University for Science and Technology (MUST) is proud to announce the opening of applications for Teaching Assistant positions. We are looking for our top-performing graduates from the classes of 2022, 2023, and 2024 to join the Faculty of Information Technology and contribute to our academic excellence',
  NULL,
  CONCAT(@ImageBaseUrl, N'/images/seed/m11.jpeg'),
  CAST('2025-06-01 12:00:00 +02:00' AS DATETIMEOFFSET),
  0, 1, @Now, NULL
),
(
  N'The Faculty of Information Technology at Misr University for Science and Technology (MUST) is announcing vacancies for Teaching Assistant positions for the 2024-2025 class. We are seeking talented candidates in Computer Science, Information Systems, and Artificial Intelligence. Interested applicants should submit their documents to it.faculty@must.edu.eg before September 25, 2025',
  NULL,
  CONCAT(@ImageBaseUrl, N'/images/seed/m22.jpeg'),
  CAST('2025-08-15 12:00:00 +02:00' AS DATETIMEOFFSET),
  1, 1, @Now, NULL
),
(
  N'Master''s Degree in Computer Science – Now Open for Applications! Join the Faculty of IT at MUST University for an intensive 18-month program (36 credit hours). Future-proof your career and apply today by scanning the QR code in the image!',
  NULL,
  CONCAT(@ImageBaseUrl, N'/images/seed/m33.jpeg'),
  CAST('2025-07-01 12:00:00 +02:00' AS DATETIMEOFFSET),
  2, 1, @Now, NULL
);

/* ---------- Events ---------- */
INSERT INTO Events (Title, EventDate, Location, TimeRange, Description, AccentColor, ImageUrl, SortOrder, CreatedAt, UpdatedAt)
VALUES
(
  N'College of Information Technology conference entitle...',
  CAST('2025-11-06 11:00:00 +02:00' AS DATETIMEOFFSET),
  N'Conference Hall',
  N'11:00 am - 5:00 pm',
  N'As inspirational as it gets! We couldn''t be more proud of our MUSTians sharing their success stories on the MUST stage.',
  N'#3b4b81',
  CONCAT(@ImageBaseUrl, N'/images/seed/z11.jpeg'),
  0, @Now, NULL
),
(
  N'International Day for Women and Girls...',
  CAST('2025-02-11 10:00:00 +02:00' AS DATETIMEOFFSET),
  N'Conference Hall',
  N'10:00 am - 3:00 pm',
  N'Get ready to take in all the business slang and principles from the best in the field in the "BUSINESS 101" panel discussion!',
  N'#3b4b81',
  CONCAT(@ImageBaseUrl, N'/images/seed/z22.jpeg'),
  1, @Now, NULL
),
(
  N'MUST Winter Festival',
  CAST('2025-12-11 10:00:00 +02:00' AS DATETIMEOFFSET),
  N'MUST Golf Garden',
  N'10:00 am - 7:00 pm',
  N'Ready to revive cozy winter nights? How''s that...slang and principles from the best in the field in the songs',
  N'#3b4b81',
  CONCAT(@ImageBaseUrl, N'/images/seed/z33.jpeg'),
  2, @Now, NULL
),
(
  N'MUST Cultural Day',
  CAST('2025-02-23 10:00:00 +02:00' AS DATETIMEOFFSET),
  N'Conference Hall',
  N'10:00 am - 5:00 pm',
  N'Snippets from the "AI and Digital Transformation" panel, as industry leaders discuss how AI is reshaping the landscape of digital transformation and its impact on business strategies.',
  N'#00a651',
  CONCAT(@ImageBaseUrl, N'/images/seed/z44.jpeg'),
  3, @Now, NULL
);

/* ---------- Awards ---------- */
INSERT INTO Awards (Title, Subtitle, WinnerName, Content, ImageUrl, SortOrder, CreatedAt, UpdatedAt)
VALUES
(
  N'MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.',
  N'Kerolos Mousa',
  N'Kerolos Mousa',
  N'The team from Misr University for Science and Technology (MUST) won first place in Egypt and third place in the Arab world, qualifying for the Imagine Cup global competition, which will be held in Seattle, USA, at the end of July. Under the slogan ''Dream... Build your dream and live it,'' the sole Egyptian representative team will compete in the global competition, where qualified teams from universities around the world will vie to develop practical solutions for improving life globally using technology. The competition aims to provide more opportunities for students worldwide to acquire the skills that will help them innovate and turn ideas into reality. The winning team consists of three students: Samer Wagdy, Mostafa Zaza, and Hussein El-Sawy, all from the Faculty of Information Technology at MUST.',
  CONCAT(@ImageBaseUrl, N'/images/seed/s11.jpeg'),
  0, @Now, NULL
),
(
  N'MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.',
  N'Mostafa',
  N'Mostafa',
  N'We have saved the third place in Imagine Cup World Simi-final ''Pan Arab'' Innovation category for Egypt our lovely country, which was held in Qatar, competing with 23 teams from 13 Arab country. It was a great honor to meet all of that innovators around the Arab world :)',
  CONCAT(@ImageBaseUrl, N'/images/seed/s22.jpeg'),
  1, @Now, NULL
),
(
  N'MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.',
  N'Mostafa',
  N'Mostafa',
  N'With more than 2700 applied startups, GBarena got selected among 70 other startups to be funded by the French government with incubation for one year in Marseille at Belle de Mai, to helping us enter the European esports market.',
  CONCAT(@ImageBaseUrl, N'/images/seed/s33.jpeg'),
  2, @Now, NULL
),
(
  N'MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.',
  N'Mostafa',
  N'Mostafa',
  N'GBarena has been selected to be one of the 50 startup world cup finalist projects from all over the world competing with the most promising startups in Copenhagen',
  CONCAT(@ImageBaseUrl, N'/images/seed/s33.jpeg'),
  3, @Now, NULL
),
(
  N'MUST Is A Pioneer In Getting Awards In All Fields Thanks To Its Precious Leading Authority And Success Seeking Students.',
  N'Mostafa',
  N'Mostafa',
  N'The prize rewards entrepreneurs for developing products or services that use ICT in an innovative way to achieve social impact and meet the needs of Africans in the energy field. ''Twinkle Box''. Officially Honored by Mobinil Egypt for our achievement',
  CONCAT(@ImageBaseUrl, N'/images/seed/s44.jpeg'),
  4, @Now, NULL
);

/* ---------- Alumni ---------- */
INSERT INTO Alumni (Name, ShortDescription, FullBio, ImageUrl, SortOrder, CreatedAt, UpdatedAt)
VALUES
(
  N'Ahmed Hesham Douma',
  N'Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.',
  N'Ahmed Hesham Douma, 🎓💻 a 2013 Information Technology and Artificial Intelligence graduate from MUST, is now the founder of TechieVai in Germany 🇩🇪.' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'His passion for computer science, combined with the education he received at MUST, ignited his journey into the world of Embedded Systems and Automotive Software Engineering .' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'He began his career at VALEO, then moved to Germany where he took on key roles at BOSCH and BOSE, contributing to the advancement of automotive technologies .' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'Today, he''s leading innovation in safety-critical systems through his own consultancy .' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'Along the way, he also earned a Master''s degree in Management and International Marketing in Germany , a clear reflection of his continuous growth and commitment to excellence. ',
  CONCAT(@ImageBaseUrl, N'/images/seed/a11.jpeg'),
  0, @Now, NULL
),
(
  N'Abdulrahman AlGhamdi',
  N'Abdulrahman AlGhamdi, Class of 2011, a strong foundation in cybersecurity. The education he gained at the university enabled him to advance into key security roles',
  N'The College of Information Technology and Artificial Intelligence at MUST provided Abdulrahman AlGhamdi, Class of 2011, a strong foundation in cybersecurity. The education he gained at the university enabled him to advance into key security roles, contributing to national initiatives under Saudi Vision 2030 while working with PIF and the Royal Court. With over 14 years of experience, he continues to lead major security transformations, ensuring top protection standards for organizations.',
  CONCAT(@ImageBaseUrl, N'/images/seed/a44.jpeg'),
  1, @Now, NULL
),
(
  N'Samer Wagdy ',
  N'Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,',
  N'Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates, transformed their graduation project into GBarena, a startup that became a leading gaming and esports platform in the region, after winning first place at Microsoft''s Imagine Cup.' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'These two passionate entrepreneurs went from classmates to co-founders, showing how the right education, ambition, and friendship can spark global success.' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'Today, with investors from KSA, the UAE, and Egypt, they continue to innovate and expand, proving that the opportunities at MUST extend far beyond graduation!',
  CONCAT(@ImageBaseUrl, N'/images/seed/a22.jpeg'),
  2, @Now, NULL
),
(
  N'Mostafa Zaza',
  N' Mostafa Zaza , 2014 Information Technology and Artificial Intelligence graduates.. transformed their graduation project into GBarena,',
  N'Samer Wagdy  , 2014 Information Technology and Artificial Intelligence graduates, transformed their graduation project into GBarena, a startup that became a leading gaming and esports platform in the region, after winning first place at Microsoft''s Imagine Cup.' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'These two passionate entrepreneurs went from classmates to co-founders, showing how the right education, ambition, and friendship can spark global success.' + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10)
    + N'Today, with investors from KSA, the UAE, and Egypt, they continue to innovate and expand, proving that the opportunities at MUST extend far beyond graduation!',
  CONCAT(@ImageBaseUrl, N'/images/seed/a33.jpeg'),
  3, @Now, NULL
);

/* ---------- HeroSlides ---------- */
INSERT INTO HeroSlides (Title, ImageUrl, SortOrder, CreatedAt, UpdatedAt)
VALUES
(NULL, CONCAT(@ImageBaseUrl, N'/images/seed/back22.jpg'), 0, @Now, NULL),
(NULL, CONCAT(@ImageBaseUrl, N'/images/seed/mmm.jpeg'), 1, @Now, NULL),
(NULL, CONCAT(@ImageBaseUrl, N'/images/seed/loz.jpeg'), 2, @Now, NULL),
(NULL, CONCAT(@ImageBaseUrl, N'/images/seed/loz2.jpeg'), 3, @Now, NULL),
(NULL, CONCAT(@ImageBaseUrl, N'/images/seed/loz3.jpeg'), 4, @Now, NULL);

/* ---------- SyndicateCards (Arabic titles/buttons from original Home.jsx) ---------- */
INSERT INTO SyndicateCards (Title, ImageUrl, Link, ButtonText, SortOrder, CreatedAt, UpdatedAt)
VALUES
(
  N'الشعار الرسمي',
  CONCAT(@ImageBaseUrl, N'/images/seed/111.jpeg'),
  N'https://www.facebook.com/EsspEgypt',
  N'صفحة الفيسبوك',
  0, @Now, NULL
),
(
  N'كيفيه الاشتراكات',
  CONCAT(@ImageBaseUrl, N'/images/seed/ege.jpeg'),
  N'https://www.hugedomains.com/domain_profile.cfm?d=esspegypt.com&sfnsn=scwspwa',
  N'الموقع الرسمي',
  1, @Now, NULL
);

COMMIT TRANSACTION;

PRINT N'SeedOriginalHomeStaticData.sql completed. Copy image files from src/assets into public/images/seed/ with the filenames used above, or set @ImageBaseUrl and host them accordingly.';
