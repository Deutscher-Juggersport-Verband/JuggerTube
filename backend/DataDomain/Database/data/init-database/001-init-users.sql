INSERT IGNORE INTO users (
    username,
    escaped_username,
    password_hash,
    name,
    email,
    role
) VALUES
('Nalochen', 'nalochen', 'scrypt:32768:8:1$QutnwO9Fl9W0BS4m$5e611cc91fa783adf677c50bae3eb7e558b7ad7014c6534298bd9df349729de0e9ea0817ef6c0792920ccdc8cdd874953fdbba0a456ebd61955628016237dcd0', 'Nalo', 'nalo@test.de', 'ADMIN'),
('Test', 'test', 'scrypt:32768:8:1$QutnwO9Fl9W0BS4m$5e611cc91fa783adf677c50bae3eb7e558b7ad7014c6534298bd9df349729de0e9ea0817ef6c0792920ccdc8cdd874953fdbba0a456ebd61955628016237dcd0', 'Tester', 'test@test.de', 'ADMIN'),
('Test 2', 'test2', 'scrypt:32768:8:1$QutnwO9Fl9W0BS4m$5e611cc91fa783adf677c50bae3eb7e558b7ad7014c6534298bd9df349729de0e9ea0817ef6c0792920ccdc8cdd874953fdbba0a456ebd61955628016237dcd0', 'Tester 2', 'test2@test.de', 'USER');
