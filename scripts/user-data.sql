INSERT INTO "user" (id, email, password, name, roles)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', '$2b$10$Q9p4jTtVi9.clVVBBQsjLexKdr2tJ/sXvmJG69m35T6ZLsgtciUbK', 'Admin User', '{"admin"}'),
  ('11111111-1111-1111-1111-111111111112', 'manager@example.com', '$2b$10$zUAUqkdTl27NJZLfW0UHAet/CsaeDfAxTxfph8a/8YodNktbVj6V.', 'Manager User', '{"manager"}'),
  ('11111111-1111-1111-1111-111111111113', 'client1@example.com', '$2b$10$R2mkXLBDeuFmwBPk26zQGe0ybsJ1lzPayvPpPPV194P6b46DnDlrK', 'Client One', '{"client"}'),
  ('11111111-1111-1111-1111-111111111114', 'client2@example.com', '$2b$10$QBmYP2pPoUTzN4jeGJ2DfeTwcGbBt94s7JNrst2XF1HMR0jP0w0Uq', 'Client Two', '{"client"}');

-- admin123
-- manager123
-- client123
-- client124