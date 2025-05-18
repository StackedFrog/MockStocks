
-- Insert mock users
INSERT INTO Users (user_id, email, username, password, oauth_id, role, balance) VALUES
('7a43b5fe-1c2f-4a1b-a9fa-100000000001', 'alice@example.com', 'alice123', 'hashed_password_1', NULL, 'user', 24300.50),
('b2f8c947-e20f-4a1a-b5c5-100000000002', 'bob@example.com', 'bobby', 'hashed_password_2', NULL, 'admin', 50000.00),
('c3d9e3a6-5555-41cc-bdd4-100000000003', 'charlie@example.com', 'charlie88', NULL, 'google_oauth_333', 'user', 19950.00),
('d4aa2f4f-3451-4567-a111-100000000004', 'diana@example.com', 'dianaD', 'hashed_password_4', NULL, 'user', 28700.75),
('e5bb4a99-9988-4321-aaaa-100000000005', 'eve@example.com', 'eveQ', NULL, 'github_oauth_999', 'user', 23550.25);

INSERT INTO Transactions (transaction_id, user_id, date, symbol, amount, price, transaction_type, quantity) VALUES
('98f0efc2-5e5b-4c1d-8124-111111111111', '7a43b5fe-1c2f-4a1b-a9fa-100000000001', '2025-05-17 10:30:00+00', 'AAPL', 1200.50, 150.06, 'purchase', 8),
('24ec7552-6f1a-4c47-91b2-222222222222', 'b2f8c947-e20f-4a1a-b5c5-100000000002', '2025-05-16 14:10:00+00', 'GOOG', 2000.00, 2000.00, 'purchase', 1),
('3c8f3e98-444b-4f02-bf0e-333333333333', 'c3d9e3a6-5555-41cc-bdd4-100000000003', '2025-05-15 09:00:00+00', 'TSLA', 950.00, 950.00, 'purchase', 1),
('4d00d4b1-c9c2-42fc-aaa5-444444444444', 'd4aa2f4f-3451-4567-a111-100000000004', '2025-05-15 11:00:00+00', 'AMZN', 1300.00, 260.00, 'purchase', 5),
('5e115f2d-e2c8-4ac1-9999-555555555555', 'e5bb4a99-9988-4321-aaaa-100000000005', '2025-05-14 12:00:00+00', 'MSFT', 1800.25, 300.04, 'purchase', 6),
('6f227a8b-88d3-48ce-8cc1-666666666666', '7a43b5fe-1c2f-4a1b-a9fa-100000000001', '2025-05-18 08:20:00+00', 'AAPL', 750.30, 150.06, 'sale', 5),
('7a33be67-91ed-4c8b-8b14-777777777777', 'd4aa2f4f-3451-4567-a111-100000000004', '2025-05-18 13:30:00+00', 'AMZN', 260.00, 260.00, 'sale', 1),
('88c47023-0e4e-470e-9a5a-888888888888', 'b2f8c947-e20f-4a1a-b5c5-100000000002', '2025-05-18 15:00:00+00', 'GOOG', 2000.00, 2000.00, 'sale', 1),
('99b572f1-dc92-4a19-8092-999999999999', 'c3d9e3a6-5555-41cc-bdd4-100000000003', '2025-05-17 17:00:00+00', 'TSLA', 950.00, 950.00, 'sale', 1),
('aa93e3fc-5d9f-4a3d-9923-aaaaaaaaaaaa', 'e5bb4a99-9988-4321-aaaa-100000000005', '2025-05-18 16:00:00+00', 'MSFT', 300.04, 300.04, 'sale', 1);

INSERT INTO Holdings (user_id, symbol, quantity, last_updated) VALUES
('7a43b5fe-1c2f-4a1b-a9fa-100000000001', 'AAPL', 3, '2025-05-18 08:20:00+00'),
('b2f8c947-e20f-4a1a-b5c5-100000000002', 'GOOG', 0, '2025-05-18 15:00:00+00'),
('c3d9e3a6-5555-41cc-bdd4-100000000003', 'TSLA', 0, '2025-05-17 17:00:00+00'),
('d4aa2f4f-3451-4567-a111-100000000004', 'AMZN', 4, '2025-05-18 13:30:00+00'),
('e5bb4a99-9988-4321-aaaa-100000000005', 'MSFT', 5, '2025-05-18 16:00:00+00');
