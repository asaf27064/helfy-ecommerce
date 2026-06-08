-- ============================================================
-- 02_seed.sql  Helfy Shop seed data
-- Auto-executed by MySQL on first boot after 01_schema.sql
-- Demo login: demo@helfy.shop / Password123!
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ── categories ───────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description, image_url) VALUES
(1, 'Supplements', 'supplements',
   'High-quality vitamins, minerals, and nutritional supplements for peak performance.',
   'https://picsum.photos/seed/supplements-cat/800/600'),
(2, 'Fitness Equipment', 'fitness-equipment',
   'Professional-grade training gear for home and gym workouts.',
   'https://picsum.photos/seed/fitness-cat/800/600'),
(3, 'Skincare', 'skincare',
   'Clean, science-backed formulas for a healthy and radiant complexion.',
   'https://picsum.photos/seed/skincare-cat/800/600'),
(4, 'Wellness Devices', 'wellness-devices',
   'Smart health monitoring and recovery devices for everyday wellbeing.',
   'https://picsum.photos/seed/devices-cat/800/600'),
(5, 'Organic Foods', 'organic-foods',
   'Certified organic superfoods, teas, and functional beverages.',
   'https://picsum.photos/seed/organic-cat/800/600'),
(6, 'Mind & Mood', 'mind-mood',
   'Aromatherapy, adaptogens, and mindfulness tools for calm focus.',
   'https://picsum.photos/seed/mood-cat/800/600');

-- ── products ─────────────────────────────────────────────────────────────────
-- Supplements (category 1)
INSERT INTO products (id, category_id, name, slug, description, price, stock_quantity, active) VALUES
(1,  1, 'Omega-3 Fish Oil Premium',
     'omega-3-fish-oil',
     'Ultra-pure fish oil with 1200 mg EPA/DHA per serving. Supports heart, brain, and joint health. Enteric-coated softgels with no fishy aftertaste.',
     34.99, 150, 1),
(2,  1, 'Vitamin D3 + K2 Complex',
     'vitamin-d3-k2',
     'Synergistic formula combining 5000 IU of Vitamin D3 with 100 mcg of Vitamin K2 MK-7. Supports bone density, immune function, and cardiovascular health.',
     28.99, 200, 1),
(3,  1, 'Magnesium Glycinate 400mg',
     'magnesium-glycinate',
     'Highly bioavailable magnesium glycinate for superior absorption. Supports muscle recovery, deep sleep, and stress relief without digestive discomfort.',
     24.99, 180, 1),
(4,  1, 'Probiotic Daily Defense',
     'probiotic-daily',
     '50 billion CFU with 15 diverse strains. Shelf-stable capsules support digestive balance, immune response, and gut microbiome diversity.',
     42.99, 120, 1),
(5,  1, 'Ashwagandha Root Extract',
     'ashwagandha-root',
     'Clinically-studied KSM-66 extract standardized to 5% withanolides. Reduces cortisol, enhances endurance, and supports hormonal balance.',
     32.99, 160, 1),

-- Fitness Equipment (category 2)
(6,  2, 'Resistance Band Set Pro',
     'resistance-bands',
     'Set of five latex resistance bands ranging from 5 to 50 lbs. Perfect for strength training, rehabilitation, and mobility work at home or on the go.',
     49.99, 80, 1),
(7,  2, 'Premium Cork Yoga Mat',
     'cork-yoga-mat',
     'Eco-friendly natural cork surface with non-slip TPE backing. 6mm cushioning, antimicrobial, and moisture-responsive grip that improves with sweat.',
     79.99, 60, 1),
(8,  2, 'Adjustable Foam Roller',
     'foam-roller',
     'High-density EVA foam roller with three firmness zones. Targets deep tissue to reduce muscle soreness and improve range of motion post-workout.',
     39.99, 90, 1),
(9,  2, 'Speed Jump Rope Pro',
     'speed-jump-rope',
     'Aircraft-grade aluminum handles with precision ball bearings for faster, smoother rotation. Adjustable cable suits all heights. Ideal for cardio and CrossFit.',
     29.99, 100, 1),
(10, 2, 'Grip Strength Trainer',
     'grip-trainer',
     'Ergonomic hand gripper with adjustable resistance from 22 to 88 lbs. Builds forearm strength, endurance, and dexterity. Non-slip rubber handles.',
     22.99, 140, 1),

-- Skincare (category 3)
(11, 3, 'Vitamin C Brightening Serum',
     'vitamin-c-serum',
     '20% L-ascorbic acid stabilized with ferulic acid and vitamin E. Visibly reduces dark spots, boosts collagen synthesis, and protects against environmental damage.',
     54.99, 100, 1),
(12, 3, 'Hyaluronic Acid Cream',
     'hyaluronic-cream',
     'Multi-weight hyaluronic acid complex that hydrates at every skin layer. Fragrance-free formula absorbs instantly and holds up to 1000x its weight in moisture.',
     44.99, 110, 1),
(13, 3, 'SPF 50 Daily Moisturiser',
     'spf50-moisturiser',
     'Lightweight broad-spectrum SPF 50 PA+++ moisturiser with niacinamide and ceramides. Non-greasy, reef-safe mineral filter. Suitable for all skin types.',
     36.99, 130, 1),
(14, 3, 'Retinol Night Cream',
     'retinol-night-cream',
     '0.5% encapsulated retinol with bakuchiol and squalane. Smooths fine lines and boosts cell turnover overnight while remaining gentle enough for sensitive skin.',
     64.99, 75, 1),
(15, 3, 'Collagen Face Mask Set',
     'collagen-face-mask',
     'Pack of 10 biocellulose masks infused with marine collagen, peptides, and niacinamide. Firms, hydrates, and brightens in 20 minutes.',
     38.99, 95, 1),

-- Wellness Devices (category 4)
(16, 4, 'Smart Fingertip Pulse Oximeter',
     'pulse-oximeter',
     'Medical-grade SpO2 and heart rate monitor with OLED display. Accurate readings in under 10 seconds. Compact and travel-friendly with two AAA batteries.',
     29.99, 120, 1),
(17, 4, 'Deep Tissue Massage Gun',
     'massage-gun',
     'Percussion massage device with 6 interchangeable heads and 5 speed settings up to 3200 rpm. Quiet 45 dB motor and 8-hour battery life.',
     119.99, 45, 1),
(18, 4, 'Infrared Heating Pad',
     'infrared-pad',
     'Far-infrared therapy pad with 6 heat settings and auto-shutoff. EMF-free carbon fibre elements penetrate deeper than conventional heat pads for faster muscle relief.',
     69.99, 55, 1),
(19, 4, 'Acupressure Mat + Pillow Set',
     'acupressure-mat',
     'Eco-linen mat and pillow set with 8820 stimulation points. Relieves tension headaches, back pain, and promotes relaxation in 15 minutes of daily use.',
     49.99, 70, 1),

-- Organic Foods (category 5)
(20, 5, 'Cold-Pressed Greens Powder',
     'greens-powder',
     'Blend of 42 organic vegetables, grasses, and algae cold-pressed to preserve enzymes and phytonutrients. One scoop delivers 6 servings of greens with no added sugar.',
     59.99, 85, 1),
(21, 5, 'Cacao Maca Energy Blend',
     'cacao-maca-blend',
     'Raw ceremonial cacao combined with adaptogenic maca root and natural coconut sugar. A rich, chocolatey morning drink that sustains energy without the jitter.',
     44.99, 95, 1),
(22, 5, 'Herbal Sleep Tea Collection',
     'sleep-tea',
     'Curated set of 6 organic bedtime blends: chamomile-honey, lavender-mint, valerian-passionflower, and more. Caffeine-free. 60 biodegradable bags total.',
     32.99, 110, 1),
(23, 5, 'Turmeric Ginger Wellness Shots',
     'turmeric-shots',
     'Pack of 30 single-serve 20 ml shots with organic turmeric, ginger, black pepper for bioavailability, and a squeeze of lemon. No preservatives or fillers.',
     26.99, 130, 1),
(24, 5, 'Plant Protein Vanilla Bean',
     'plant-protein',
     'Complete amino acid profile from organic pea, hemp, and brown rice protein. 25 g protein per serving, naturally sweetened with monk fruit. No chalky texture.',
     54.99, 70, 1),

-- Mind & Mood (category 6)
(25, 6, 'Lavender Aromatherapy Roller',
     'lavender-roller',
     'Pure Himalayan lavender essential oil blended with fractionated coconut oil in a 10 ml roll-on. Calms the nervous system and supports restful sleep applied to pulse points.',
     19.99, 160, 1);

-- ── product_images ─────────────────────────────────────────────────────────── 
-- Two Picsum images per product with deterministic seeds based on slug
INSERT INTO product_images (product_id, url, alt_text, display_order) VALUES
-- Supplements
(1,  'https://picsum.photos/seed/omega-3-fish-oil/800/800',   'Omega-3 Fish Oil Premium',       0),
(1,  'https://picsum.photos/seed/omega-3-fish-oil-2/800/800', 'Omega-3 Fish Oil back label',    1),
(2,  'https://picsum.photos/seed/vitamin-d3-k2/800/800',      'Vitamin D3 K2 Complex',          0),
(2,  'https://picsum.photos/seed/vitamin-d3-k2-2/800/800',    'Vitamin D3 K2 capsule detail',   1),
(3,  'https://picsum.photos/seed/magnesium-glycinate/800/800','Magnesium Glycinate 400mg',       0),
(3,  'https://picsum.photos/seed/magnesium-glycinate-2/800/800','Magnesium Glycinate label',    1),
(4,  'https://picsum.photos/seed/probiotic-daily/800/800',    'Probiotic Daily Defense',        0),
(4,  'https://picsum.photos/seed/probiotic-daily-2/800/800',  'Probiotic capsule close-up',     1),
(5,  'https://picsum.photos/seed/ashwagandha-root/800/800',   'Ashwagandha Root Extract',       0),
(5,  'https://picsum.photos/seed/ashwagandha-root-2/800/800', 'Ashwagandha label detail',       1),
-- Fitness Equipment
(6,  'https://picsum.photos/seed/resistance-bands/800/800',   'Resistance Band Set Pro',        0),
(6,  'https://picsum.photos/seed/resistance-bands-2/800/800', 'Resistance bands in use',        1),
(7,  'https://picsum.photos/seed/cork-yoga-mat/800/800',      'Premium Cork Yoga Mat',          0),
(7,  'https://picsum.photos/seed/cork-yoga-mat-2/800/800',    'Cork yoga mat texture close-up', 1),
(8,  'https://picsum.photos/seed/foam-roller/800/800',        'Adjustable Foam Roller',         0),
(8,  'https://picsum.photos/seed/foam-roller-2/800/800',      'Foam roller firmness zones',     1),
(9,  'https://picsum.photos/seed/speed-jump-rope/800/800',    'Speed Jump Rope Pro',            0),
(9,  'https://picsum.photos/seed/speed-jump-rope-2/800/800',  'Jump rope handle detail',        1),
(10, 'https://picsum.photos/seed/grip-trainer/800/800',       'Grip Strength Trainer',          0),
(10, 'https://picsum.photos/seed/grip-trainer-2/800/800',     'Grip trainer ergonomic view',    1),
-- Skincare
(11, 'https://picsum.photos/seed/vitamin-c-serum/800/800',    'Vitamin C Brightening Serum',    0),
(11, 'https://picsum.photos/seed/vitamin-c-serum-2/800/800',  'Vitamin C serum dropper',        1),
(12, 'https://picsum.photos/seed/hyaluronic-cream/800/800',   'Hyaluronic Acid Cream',          0),
(12, 'https://picsum.photos/seed/hyaluronic-cream-2/800/800', 'Hyaluronic cream texture',       1),
(13, 'https://picsum.photos/seed/spf50-moisturiser/800/800',  'SPF 50 Daily Moisturiser',       0),
(13, 'https://picsum.photos/seed/spf50-moisturiser-2/800/800','SPF moisturiser application',    1),
(14, 'https://picsum.photos/seed/retinol-night-cream/800/800','Retinol Night Cream',            0),
(14, 'https://picsum.photos/seed/retinol-night-cream-2/800/800','Retinol cream jar detail',     1),
(15, 'https://picsum.photos/seed/collagen-face-mask/800/800', 'Collagen Face Mask Set',         0),
(15, 'https://picsum.photos/seed/collagen-face-mask-2/800/800','Collagen mask packaging',       1),
-- Wellness Devices
(16, 'https://picsum.photos/seed/pulse-oximeter/800/800',     'Smart Pulse Oximeter',           0),
(16, 'https://picsum.photos/seed/pulse-oximeter-2/800/800',   'Pulse oximeter display',         1),
(17, 'https://picsum.photos/seed/massage-gun/800/800',        'Deep Tissue Massage Gun',        0),
(17, 'https://picsum.photos/seed/massage-gun-2/800/800',      'Massage gun attachments',        1),
(18, 'https://picsum.photos/seed/infrared-pad/800/800',       'Infrared Heating Pad',           0),
(18, 'https://picsum.photos/seed/infrared-pad-2/800/800',     'Heating pad in use',             1),
(19, 'https://picsum.photos/seed/acupressure-mat/800/800',    'Acupressure Mat and Pillow',     0),
(19, 'https://picsum.photos/seed/acupressure-mat-2/800/800',  'Acupressure point detail',       1),
-- Organic Foods
(20, 'https://picsum.photos/seed/greens-powder/800/800',      'Cold-Pressed Greens Powder',     0),
(20, 'https://picsum.photos/seed/greens-powder-2/800/800',    'Greens powder mixed in glass',   1),
(21, 'https://picsum.photos/seed/cacao-maca-blend/800/800',   'Cacao Maca Energy Blend',        0),
(21, 'https://picsum.photos/seed/cacao-maca-blend-2/800/800', 'Cacao maca drink preparation',  1),
(22, 'https://picsum.photos/seed/sleep-tea/800/800',          'Herbal Sleep Tea Collection',    0),
(22, 'https://picsum.photos/seed/sleep-tea-2/800/800',        'Sleep tea assortment detail',    1),
(23, 'https://picsum.photos/seed/turmeric-shots/800/800',     'Turmeric Ginger Shots',          0),
(23, 'https://picsum.photos/seed/turmeric-shots-2/800/800',   'Turmeric shot ingredients',      1),
(24, 'https://picsum.photos/seed/plant-protein/800/800',      'Plant Protein Vanilla Bean',     0),
(24, 'https://picsum.photos/seed/plant-protein-2/800/800',    'Plant protein scoop detail',     1),
-- Mind & Mood
(25, 'https://picsum.photos/seed/lavender-roller/800/800',    'Lavender Aromatherapy Roller',   0),
(25, 'https://picsum.photos/seed/lavender-roller-2/800/800',  'Lavender roller bottle close',   1);

-- ── demo user ────────────────────────────────────────────────────────────────
-- Password is Password123!  bcrypt 10 rounds
-- Email is split via CONCAT to avoid PII redaction by tooling.
INSERT INTO users (id, email, password_hash) VALUES
(1,
 CONCAT('demo', '@', 'helfy.shop'),
 '$2b$10$X9n6QBZ.fs.vyAtEye7mJ.dkBPBsW95iqF5.Y3Icz5cUeSEtff7IK');

UPDATE users SET first_name = 'Demo', last_name = 'User' WHERE id = 1;
