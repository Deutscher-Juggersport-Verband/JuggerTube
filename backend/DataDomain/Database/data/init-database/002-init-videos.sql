INSERT IGNORE INTO videos (
    name,
    category,
    video_link,
    upload_date,
    comment,
    date_of_recording,
    channel_id,
   tournament_id,
   team_one_id,
   team_two_id
) VALUES
('Testvideo 1', 'reports', 'https://youtu.be/f27SC622NvE', '2028-03-10T23:00:00', 'comment', NULL, 1, 1, 1, 2),
('Testvideo 2', 'highlights', 'https://youtu.be/f27SC622Nv', '2028-03-10T23:00:00', 'comment', NULL, 1, 2, 3, 4),
('Testvideo 3', 'sparbuilding', 'https://youtu.be/f27SC622N', '2028-03-10T23:00:00', 'comment', NULL, 1, 3, 5, 6),
('Testvideo 4', 'match', 'https://youtu.be/f27SC622', '2028-03-10T23:00:00', 'comment', NULL, 1, 4, 7, 8),
('Testvideo 5', 'song', 'https://youtu.be/f27SC62', '2028-03-10T23:00:00', 'comment', NULL, 2, 5, 9, 10),
('Testvideo 6', 'podcast', 'https://youtu.be/f27SC6', '2028-03-10T23:00:00', 'comment', NULL, 3, 6, 11, 12),
('Testvideo 7', 'awards', 'https://youtu.be/f27SC', '2028-03-10T23:00:00', 'comment', NULL, 4, 1, 13, 14),
('Testvideo 8', 'training', 'https://youtu.be/f27S', '2028-03-10T23:00:00', 'comment', NULL, 5, 2, 15, 16),
('Testvideo 9', 'other', 'https://youtu.be/f27', '2028-03-10T23:00:00', 'comment', NULL, 6, 3, 17, 18);
