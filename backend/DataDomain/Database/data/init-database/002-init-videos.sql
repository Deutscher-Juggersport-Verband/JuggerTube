INSERT IGNORE INTO videos (
    name,
    category,
    video_link,
    upload_date,
    comment,
    date_of_recording,
    status,
    channel_id,
   tournament_id,
   team_one_id,
   team_two_id,
   uploader_id
) VALUES
('Testvideo 1', 'reports', 'https://youtu.be/f27SC622NvE', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 1, 1, 1, 2, 1),
('Testvideo 2', 'highlights', 'https://youtu.be/f27SC622Nv', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 1, 2, 3, 4, 1),
('Testvideo 3', 'sparbuilding', 'https://youtu.be/f27SC622N', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 1, 3, 5, 6, 2),
('Testvideo 4', 'match', 'https://youtu.be/f27SC622', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 1, 4, 7, 8, 2),
('Testvideo 5', 'song', 'https://youtu.be/f27SC62', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 2, 5, 9, 10, 3),
('Testvideo 6', 'podcast', 'https://youtu.be/f27SC6', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 3, 6, 11, 12, 3),
('Testvideo 7', 'awards', 'https://youtu.be/f27SC', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 4, 1, 13, 14, 3),
('Testvideo 8', 'training', 'https://youtu.be/f27S', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 5, 2, 15, 16, 3),
('Testvideo 9', 'other', 'https://youtu.be/f27', '2028-03-10T23:00:00', 'comment', NULL, 'approved', 6, 3, 17, 18, 3);
