-- ============================================================
-- 01_schema.sql  Helfy Shop database schema
-- Auto-executed by MySQL on first boot via docker-entrypoint-initdb.d
-- Column notes:
--   active       = product visibility flag (1=visible, 0=hidden)
--   street1/2    = address lines 1 and 2
--   shipping_street1/2 = order shipping address lines
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ── users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  email         VARCHAR(200)  NOT NULL,
  password_hash VARCHAR(100)  NOT NULL,
  first_name    VARCHAR(100)  NOT NULL DEFAULT '',
  last_name     VARCHAR(100)  NOT NULL DEFAULT '',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY  uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  slug        VARCHAR(100)  NOT NULL,
  description TEXT,
  image_url   TEXT,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY  uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  category_id    INT UNSIGNED,
  name           VARCHAR(200)   NOT NULL,
  slug           VARCHAR(200)   NOT NULL,
  description    TEXT,
  price          DECIMAL(10,2)  NOT NULL,
  stock_quantity INT UNSIGNED   NOT NULL DEFAULT 0,
  active         TINYINT(1)     NOT NULL DEFAULT 1,
  created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                         ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY  uq_products_slug      (slug),
  KEY         idx_products_category (category_id),
  KEY         idx_products_price    (price),
  KEY         idx_products_active   (active),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── product_images ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  product_id    INT UNSIGNED  NOT NULL,
  display_order TINYINT(1)    NOT NULL DEFAULT 0,
  url           TEXT          NOT NULL,
  alt_text      VARCHAR(200),
  PRIMARY KEY (id),
  KEY         idx_product_images_product (product_id),
  KEY         idx_product_images_order   (product_id, display_order),
  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── addresses ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,
  label       VARCHAR(50)   NOT NULL DEFAULT 'Home',
  full_name   VARCHAR(200)  NOT NULL DEFAULT '',
  street1     VARCHAR(200)  NOT NULL,
  street2     VARCHAR(200),
  city        VARCHAR(100)  NOT NULL,
  state       VARCHAR(100)  NOT NULL DEFAULT '',
  postal_code VARCHAR(20)   NOT NULL,
  country     VARCHAR(100)  NOT NULL DEFAULT '',
  is_default  TINYINT(1)    NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY         idx_addresses_user (user_id),
  CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── cart_items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED      NOT NULL,
  product_id INT UNSIGNED      NOT NULL,
  quantity   SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY  uq_cart_user_product  (user_id, product_id),
  KEY         idx_cart_items_user    (user_id),
  KEY         idx_cart_items_product (product_id),
  CONSTRAINT fk_cart_items_user
    FOREIGN KEY (user_id)    REFERENCES users    (id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── orders ───────────────────────────────────────────────────────────────────
-- Shipping columns are snapshotted at purchase time so order history is
-- unaffected by later address edits or deletions.
CREATE TABLE IF NOT EXISTS orders (
  id                    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id               INT UNSIGNED   NOT NULL,
  status                ENUM('pending','processing','shipped','delivered','cancelled')
                                       NOT NULL DEFAULT 'pending',
  subtotal              DECIMAL(10,2)  NOT NULL,
  shipping_amount       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  tax_amount            DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  total                 DECIMAL(10,2)  NOT NULL,
  shipping_name         VARCHAR(200)   NOT NULL DEFAULT '',
  shipping_street1      VARCHAR(200)   NOT NULL DEFAULT '',
  shipping_street2      VARCHAR(200),
  shipping_city         VARCHAR(100)   NOT NULL DEFAULT '',
  shipping_state        VARCHAR(100)   NOT NULL DEFAULT '',
  shipping_postal_code  VARCHAR(20)    NOT NULL DEFAULT '',
  shipping_country      VARCHAR(100)   NOT NULL DEFAULT '',
  created_at            DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                                ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY         idx_orders_user       (user_id),
  KEY         idx_orders_status     (status),
  KEY         idx_orders_created_at (created_at),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── order_items ──────────────────────────────────────────────────────────────
-- product_name and product_price are snapshotted so order history stays
-- accurate even if the product is later renamed or repriced.
CREATE TABLE IF NOT EXISTS order_items (
  id            INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  order_id      INT UNSIGNED      NOT NULL,
  product_id    INT UNSIGNED,
  product_name  VARCHAR(200)      NOT NULL,
  product_price DECIMAL(10,2)     NOT NULL,
  quantity      SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  line_total    DECIMAL(10,2)     NOT NULL,
  created_at    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY         idx_order_items_order   (order_id),
  KEY         idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id)   REFERENCES orders   (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
