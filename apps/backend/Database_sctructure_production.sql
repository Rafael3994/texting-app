CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(5) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL,
  user_id_2 UUID NOT NULL,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_id_1 FOREIGN KEY (user_id_1) REFERENCES "user" (id),
  CONSTRAINT fk_user_id_2 FOREIGN KEY (user_id_2) REFERENCES "user" (id)
);

CREATE TABLE text (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  user_id UUID NOT NULL,
  text VARCHAR(255) NOT NULL,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_id FOREIGN KEY (chat_id) REFERENCES chat (id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES "user" (id)
);

CREATE TABLE blacklist_refresh_token (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) NOT NULL UNIQUE,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
