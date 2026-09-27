package seeds

import (
	"log"

	"github.com/fireheart071/models"
	"gorm.io/gorm"
)

func SeedDatabase(db *gorm.DB) {
	seedBlogs(db)
	seedFAQs(db)

	var count int64
	db.Model(&models.Collection{}).Count(&count)
	if count > 0 {
		log.Println("[DB Seed] Collections already seeded, skipping.")
		return
	}

	log.Println("[DB Seed] Seeding luxury Oud Attar collections and fragrances...")

	collections := []models.Collection{
		{
			Name:        "Oud Perfume Oils",
			Slug:        "oud-perfume-oils",
			Subtitle:    "Pure Concentrated Essence",
			Description: "Specialists in infusing rich botanical perfume oils with our signature aged Oud to deliver an unforgettable oriental aroma.",
			ImageUrl:    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Signature Range",
			Featured:    true,
			SortOrder:   1,
		},
		{
			Name:        "Extrait De Parfum",
			Slug:        "extrait-de-parfum",
			Subtitle:    "High-Concentration Luxury Sprays",
			Description: "Formulated with 30-40% pure fragrance oil concentration for phenomenal longevity and sillage.",
			ImageUrl:    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Best Seller",
			Featured:    true,
			SortOrder:   2,
		},
		{
			Name:        "Royal Attars",
			Slug:        "royal-attars",
			Subtitle:    "Traditional Artisanal Blends",
			Description: "Non-alcoholic, distilled pure perfume oils crafted from Taif Rose, Wild Agarwood, and Royal Ambergris.",
			ImageUrl:    "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Artisanal",
			Featured:    true,
			SortOrder:   3,
		},
		{
			Name:        "Discovery Sets",
			Slug:        "discovery-sets",
			Subtitle:    "Experience The Wardrobe",
			Description: "Curated sample editions allowing you to experience our finest olfactory compositions before committing to full flacons.",
			ImageUrl:    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
			Badge:       "Gift Ready",
			Featured:    true,
			SortOrder:   4,
		},
		{
			Name:        "Home Fragrance & Bakhoor",
			Slug:        "home-scents",
			Subtitle:    "Sacred Incense & Room Sprays",
			Description: "Infuse your sanctuary with slow-burning Agarwood chips drenched in essential floral extracts.",
			ImageUrl:    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
			Badge:       "Atmospheric",
			Featured:    false,
			SortOrder:   5,
		},
	}

	for i := range collections {
		db.Create(&collections[i])
	}

	cOud := collections[0].ID
	cExtrait := collections[1].ID
	cAttar := collections[2].ID
	cDiscovery := collections[3].ID
	cHome := collections[4].ID

	products := []models.Product{
		{
			CollectionID:   cOud,
			Name:           "Royal Cambodian Oud",
			Slug:           "royal-cambodian-oud",
			Subtitle:       "Aged Wild Agarwood & Sweet Resins",
			Description:    "Harvested from mature Aquilaria trees in Koh Kong, aged for 12 years. Features deep balsamic nuances, subtle dried fruit sweetness, and an intoxicating smoky drydown that lingers for over 24 hours on fabric.",
			Concentration:  "Pure Perfume Oil (100% Oil)",
			ScentFamily:    "Oud",
			Gender:         "Unisex",
			Sillage:        "Enormous",
			Longevity:      "16+ Hours",
			Price:          45.00,
			CompareAtPrice: 55.00,
			ImageUrl:       "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
			Rating:         4.95,
			ReviewCount:    148,
			IsBestSeller:   true,
			IsNew:          false,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Sun-Dried Plum, Saffron, Cardamom", Description: "Rich opening with sweet spice"},
				{Layer: "heart", NoteName: "Aged Cambodian Agarwood, Smoked Leather", Description: "Dense resinous core"},
				{Layer: "base", NoteName: "Black Amber, Vetiver, Honey Tobacco", Description: "Velvety warm finish"},
			},
			Variants: []models.ProductVariant{
				{Size: "3ml Sample Roller", Price: 15.00, InStock: true},
				{Size: "6ml Crystal Dip-Stick", Price: 45.00, InStock: true},
				{Size: "12ml Regal Gold Flacon", Price: 80.00, InStock: true},
			},
			Reviews: []models.Review{
				{AuthorName: "Tariq A.", Rating: 5, Title: "Authentic Masterpiece", Comment: "Unbelievable depth. You only need a single drop on the wrists and pulse points.", VerifiedPurchase: true},
				{AuthorName: "Sarah M.", Rating: 5, Title: "Gets compliments all day", Comment: "Rich and luxurious without being screechy. The drydown is heavenly.", VerifiedPurchase: true},
			},
		},
		{
			CollectionID:   cExtrait,
			Name:           "Sultani Amber & Rose",
			Slug:           "sultani-amber-rose",
			Subtitle:       "Extrait de Parfum 35%",
			Description:    "A royal marriage of rare Damascus Rose and golden Baltic Ambergris, heightened by subtle hints of Madagascar Vanilla and smoked cashmere wood.",
			Concentration:  "Extrait de Parfum",
			ScentFamily:    "Floral",
			Gender:         "Unisex",
			Sillage:        "Strong",
			Longevity:      "14+ Hours",
			Price:          65.00,
			CompareAtPrice: 75.00,
			ImageUrl:       "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
			Rating:         4.90,
			ReviewCount:    92,
			IsBestSeller:   true,
			IsNew:          true,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Taif Rose Petals, Bergamot Sparkle", Description: "Vibrant floral overture"},
				{Layer: "heart", NoteName: "Golden Amber, Turkish Rose Absolute", Description: "Lush velvety heart"},
				{Layer: "base", NoteName: "Madagascar Vanilla, White Musk, Sandalwood", Description: "Warm addictive sillage"},
			},
			Variants: []models.ProductVariant{
				{Size: "50ml Spray Flacon", Price: 65.00, InStock: true},
				{Size: "100ml Luxury Flacon", Price: 110.00, InStock: true},
			},
			Reviews: []models.Review{
				{AuthorName: "Liam W.", Rating: 5, Title: "Pure Luxury", Comment: "Lasts on my jacket for 3 days straight. A modern classic.", VerifiedPurchase: true},
			},
		},
		{
			CollectionID:   cAttar,
			Name:           "Imperial Black Musk Attar",
			Slug:           "imperial-black-musk-attar",
			Subtitle:       "Traditional Artisanal Concentrated Oil",
			Description:    "An opulent, mystical black musk infused with dark Indian Oud, frankincense, and dark patchouli. Intense, commanding, and mesmerizing.",
			Concentration:  "Attar Concentrated Oil",
			ScentFamily:    "Oriental",
			Gender:         "For Him",
			Sillage:        "Enormous",
			Longevity:      "18+ Hours",
			Price:          50.00,
			CompareAtPrice: 60.00,
			ImageUrl:       "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
			Rating:         4.98,
			ReviewCount:    184,
			IsBestSeller:   true,
			IsNew:          false,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Omani Frankincense, Black Pepper", Description: "Dark resinous sparkle"},
				{Layer: "heart", NoteName: "Black Musk, Assam Oud, Patchouli", Description: "Animalic, warm, and deep"},
				{Layer: "base", NoteName: "Smoked Cedar, Labdanum, Dark Myrrh", Description: "Ancient sacred finish"},
			},
			Variants: []models.ProductVariant{
				{Size: "3ml Pocket Roller", Price: 18.00, InStock: true},
				{Size: "6ml Velvet Box", Price: 50.00, InStock: true},
				{Size: "12ml Gold Carved Bottle", Price: 90.00, InStock: true},
			},
		},
		{
			CollectionID:   cOud,
			Name:           "White Oud Silk",
			Slug:           "white-oud-silk",
			Subtitle:       "Clean, Creamy & Ethereal Oud",
			Description:    "A lighter, incredibly smooth take on Oud designed for daily wear. Blended with creamy Mysore sandalwood, white jasmine, and soft musk.",
			Concentration:  "Pure Perfume Oil",
			ScentFamily:    "Woody",
			Gender:         "Unisex",
			Sillage:        "Moderate",
			Longevity:      "12+ Hours",
			Price:          40.00,
			CompareAtPrice: 50.00,
			ImageUrl:       "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
			Rating:         4.88,
			ReviewCount:    76,
			IsBestSeller:   false,
			IsNew:          true,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "White Peach, Sicilian Lemon, Neroli", Description: "Luminous fresh opening"},
				{Layer: "heart", NoteName: "White Jasmine, Light Agarwood, Iris", Description: "Silky floral woodiness"},
				{Layer: "base", NoteName: "Creamy Sandalwood, White Amber, Cotton Musk", Description: "Clean skin-scent warmth"},
			},
			Variants: []models.ProductVariant{
				{Size: "6ml Crystal Dip-Stick", Price: 40.00, InStock: true},
				{Size: "12ml Regal Gold Flacon", Price: 70.00, InStock: true},
			},
		},
		{
			CollectionID:   cExtrait,
			Name:           "Tobacco Vanille Noir",
			Slug:           "tobacco-vanille-noir",
			Subtitle:       "Extrait de Parfum 35%",
			Description:    "A rich, decadent blend of cured Cuban tobacco leaf, spicy clove, roasted tonka bean, and pure Bourbon vanilla infused with aged agarwood.",
			Concentration:  "Extrait de Parfum",
			ScentFamily:    "Gourmand",
			Gender:         "Unisex",
			Sillage:        "Strong",
			Longevity:      "16+ Hours",
			Price:          70.00,
			CompareAtPrice: 85.00,
			ImageUrl:       "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
			Rating:         4.96,
			ReviewCount:    210,
			IsBestSeller:   true,
			IsNew:          false,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Tobacco Leaf, Ginger, Aromatic Spices", Description: "Warm comforting start"},
				{Layer: "heart", NoteName: "Tonka Bean, Tobacco Blossom, Cacao, Vanilla", Description: "Gourmand richness"},
				{Layer: "base", NoteName: "Dried Fruit Accord, Woody Notes, Oud Essence", Description: "Sweet smoky persistence"},
			},
			Variants: []models.ProductVariant{
				{Size: "50ml Spray Flacon", Price: 70.00, InStock: true},
				{Size: "100ml Luxury Flacon", Price: 120.00, InStock: true},
			},
		},
		{
			CollectionID:   cDiscovery,
			Name:           "The Royal Quintet Discovery Set",
			Slug:           "royal-quintet-discovery-set",
			Subtitle:       "5 x 3ml Artisan Perfume Oil Flacons",
			Description:    "Includes 3ml editions of Royal Cambodian Oud, Sultani Amber & Rose, Imperial Black Musk, White Oud Silk, and Tobacco Vanille Noir. Presented in an embossed velvet gift box.",
			Concentration:  "Pure Perfume Oils",
			ScentFamily:    "Oud",
			Gender:         "Unisex",
			Sillage:        "Strong",
			Longevity:      "14+ Hours",
			Price:          48.00,
			CompareAtPrice: 65.00,
			ImageUrl:       "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
			Rating:         4.99,
			ReviewCount:    320,
			IsBestSeller:   true,
			IsNew:          false,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Curated Variety of 5 Signature Profiles", Description: "From crisp fresh to dark smoky"},
				{Layer: "heart", NoteName: "Artisanal Agarwood, Rare Botanicals", Description: "Pure 100% oil extracts"},
				{Layer: "base", NoteName: "Rich Resins, Ambergris, Bourbon Vanilla", Description: "Unrivalled longevity"},
			},
			Variants: []models.ProductVariant{
				{Size: "5x 3ml Discovery Box", Price: 48.00, InStock: true},
			},
		},
		{
			CollectionID:   cAttar,
			Name:           "Taif Rose & Dehn Al Oud Attar",
			Slug:           "taif-rose-dehn-al-oud-attar",
			Subtitle:       "Artisanal Pure Rose & Aged Agarwood",
			Description:    "Distilled high up in the mountain terraces of Taif, harmonized with vintage Hindi Agarwood. A divine opening of fresh morning dewy petals followed by profound woody majesty.",
			Concentration:  "Pure Attar Oil (Non-Alcoholic)",
			ScentFamily:    "Floral",
			Gender:         "Unisex",
			Sillage:        "Enormous",
			Longevity:      "16+ Hours",
			Price:          55.00,
			CompareAtPrice: 68.00,
			ImageUrl:       "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
			Rating:         4.97,
			ReviewCount:    112,
			IsBestSeller:   true,
			IsNew:          true,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Taif Mountain Rose, Dew Accord", Description: "Fresh morning blossom"},
				{Layer: "heart", NoteName: "Vintage Hindi Oud, Frankincense", Description: "Spicy resinous body"},
				{Layer: "base", NoteName: "White Ambergris, Royal Sandalwood", Description: "Velvety skin trail"},
			},
			Variants: []models.ProductVariant{
				{Size: "3ml Pure Attar Flacon", Price: 20.00, InStock: true},
				{Size: "6ml Crystal Dip-Stick", Price: 55.00, InStock: true},
				{Size: "12ml Regal Gold Edition", Price: 95.00, InStock: true},
			},
		},
		{
			CollectionID:   cHome,
			Name:           "Artisan Royal Oud Bakhoor",
			Slug:           "artisan-royal-oud-bakhoor",
			Subtitle:       "Aged Agarwood Chips & Amber Resin",
			Description:    "Hand-soaked wild Aquilaria agarwood wood chips drenched in rare rose essence, frankincense oils, and amber crystals. Slowly releases tranquil aromatic clouds for home rituals.",
			Concentration:  "Luxury Incense & Bakhoor",
			ScentFamily:    "Woody",
			Gender:         "Unisex",
			Sillage:        "Enormous",
			Longevity:      "24+ Hours Sanctuary Scent",
			Price:          38.00,
			CompareAtPrice: 48.00,
			ImageUrl:       "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
			Rating:         4.94,
			ReviewCount:    68,
			IsBestSeller:   true,
			IsNew:          false,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Sweet Frankincense, Cinnamon Leaf", Description: "Luminous incense spark"},
				{Layer: "heart", NoteName: "Aged Agarwood Chips, Red Rose Petals", Description: "Deep smoky floral core"},
				{Layer: "base", NoteName: "Olibanum, Golden Amber Resin", Description: "Sacred lingering warmth"},
			},
			Variants: []models.ProductVariant{
				{Size: "50g Artisanal Glass Jar", Price: 38.00, InStock: true},
				{Size: "100g Regal Gift Box + Burner Tongs", Price: 65.00, InStock: true},
			},
		},
		{
			CollectionID:   cHome,
			Name:           "Sacred Amber & Oud Room Essence",
			Slug:           "sacred-amber-oud-room-essence",
			Subtitle:       "Atmospheric Luxury Room Spray 100ml",
			Description:    "An instant atmosphere transformer. Formulated with pure essential oils of Smoked Agarwood, Cashmere Wood, and Royal Ambergris for fine fabrics and living spaces.",
			Concentration:  "Artisanal Home Spray",
			ScentFamily:    "Amber",
			Gender:         "Unisex",
			Sillage:        "Strong",
			Longevity:      "12+ Hours",
			Price:          32.00,
			CompareAtPrice: 40.00,
			ImageUrl:       "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
			Rating:         4.89,
			ReviewCount:    45,
			IsBestSeller:   false,
			IsNew:          true,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "Cardamom, Bergamot Peel", Description: "Crisp atmospheric burst"},
				{Layer: "heart", NoteName: "Smoked Agarwood, Cashmere Amber", Description: "Cozy refined sanctuary"},
				{Layer: "base", NoteName: "Madagascar Vanilla, White Musk", Description: "Smooth serene trail"},
			},
			Variants: []models.ProductVariant{
				{Size: "100ml Luxury Glass Flacon", Price: 32.00, InStock: true},
			},
		},
		{
			CollectionID:   cDiscovery,
			Name:           "The Extrait Grand Discovery Wardrobe",
			Slug:           "extrait-grand-discovery-wardrobe",
			Subtitle:       "6 x 5ml High-Concentration Sprays",
			Description:    "The complete journey through Rabbi Azanduna's most celebrated Extrait de Parfum creations. Presented with gold-foil booklet and luxury coffret.",
			Concentration:  "Extrait de Parfum (35%)",
			ScentFamily:    "Oriental",
			Gender:         "Unisex",
			Sillage:        "Strong",
			Longevity:      "14+ Hours",
			Price:          60.00,
			CompareAtPrice: 75.00,
			ImageUrl:       "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
			HoverImageUrl:  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
			Rating:         5.0,
			ReviewCount:    156,
			IsBestSeller:   true,
			IsNew:          true,
			InStock:        true,
			Notes: []models.FragranceNote{
				{Layer: "top", NoteName: "6 Signature Extrait Profiles", Description: "Discovery selection"},
				{Layer: "heart", NoteName: "Taif Rose, Wild Agarwood, Cuban Tobacco", Description: "Unrivaled concentration"},
				{Layer: "base", NoteName: "Baltic Ambergris, Mysore Sandalwood", Description: "Longest lasting accords"},
			},
			Variants: []models.ProductVariant{
				{Size: "6 x 5ml Coffret Set", Price: 60.00, InStock: true},
			},
		},
	}

	for i := range products {
		db.Create(&products[i])
	}

	log.Printf("[DB Seed] Successfully seeded %d collections and %d luxury fragrances.", len(collections), len(products))
}

func seedBlogs(db *gorm.DB) {
	var count int64
	db.Model(&models.BlogPost{}).Count(&count)
	if count > 0 {
		return
	}

	log.Println("[DB Seed] Seeding blog articles into database...")

	posts := []models.BlogPost{
		{
			Title:     "Let Oud Be Your Love Language",
			Slug:      "let-oud-be-your-love-language",
			Excerpt:   "Oud is your gentle voice that speaks to your heart. Its deep notes connect with your senses. It whispers devotion and warmth.",
			Category:  "Rituals of Love",
			ReadTime:  "4 min read",
			ImageUrl:  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80",
			Published: true,
			SortOrder: 1,
			Content:   "In the realm of artisanal perfumery, few essences carry the poetic gravity and romantic intimacy of pure Agarwood. When words fall short, the rich, multifaceted warmth of Oud speaks in whispers of devotion.\n\nUnlike synthetic fragrances that proclaim themselves loudly before fading away, artisanal Oud melds with body chemistry, evolving organically across the hours. It becomes an invisible signature that lingers closely, creating unforgettable olfactory memories.\n\nFor centuries, lovers in the Middle East and the Orient have anointed pulse points with precious Taif Rose and aged Cambodian Oud during celebrations and sacred gatherings. Today, this tradition endures as a sublime way to express tenderness, warmth, and enduring connection.",
		},
		{
			Title:     "Manifest Your Best Year With Oud",
			Slug:      "manifest-your-best-year-with-oud",
			Excerpt:   "At the start of a new year, many of us are setting goals for the life we want to create.",
			Category:  "Mindful Living",
			ReadTime:  "5 min read",
			ImageUrl:  "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80",
			Published: true,
			SortOrder: 2,
			Content:   "At the threshold of every new chapter, setting intentions requires clarity, grounded energy, and mindful rituals. The practice of anointing oneself with pure botanicals is an ancient grounding tool.\n\nThe earthy, resinous frequency of authentic Agarwood centers the nervous system, bringing focus and calm. Incorporating a single drop of artisanal Oud into your morning reflection routine creates an anchored anchor point throughout demanding days.\n\nPair your daily focus with slow-burning incense or pure oil dabs to cultivate a sacred sanctuary wherever you go, ensuring every ambition is met with calm resilience.",
		},
		{
			Title:     "Oud Paired With The Unexpected",
			Slug:      "oud-paired-with-the-unexpected",
			Excerpt:   "In fragrance, as in many aspects of life, the most surprising combinations often yield the most captivating results.",
			Category:  "Perfumer Notes",
			ReadTime:  "6 min read",
			ImageUrl:  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
			Published: true,
			SortOrder: 3,
			Content:   "Master perfumery is fundamentally an art of balance and daring contrast. While Oud is traditionally paired with lush floral notes like Bulgarian Rose or golden Saffron, modern artisanal blending explores audacious new harmonies.\n\nThe dark, roasted bitterness of freshly ground Arabica coffee beans draws out the leather and chocolate undertones of aged Assam Agarwood. Meanwhile, crisp botanical vanilla and smoky spices temper the animalic intensity, producing an intoxicating complexity.\n\nDiscover how unexpected pairings transform timeless heritage into avant-garde signatures designed for connoisseurs who demand uniqueness.",
		},
		{
			Title:     "The Art of Applying Pure Perfume Oils for 24-Hour Longevity",
			Slug:      "how-to-apply-pure-oud-perfume-oils",
			Excerpt:   "Learn the traditional warming pulse-point technique that allows concentrated botanical oils to project gracefully throughout the day.",
			Category:  "Rituals & Guide",
			ReadTime:  "4 min read",
			ImageUrl:  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=80",
			Published: true,
			SortOrder: 4,
			Content:   "Unlike alcoholic spray perfumes that rely on rapid chemical evaporation to project scent, concentrated botanical perfume oils and pure artisanal Attars work synergistically with the natural heat of your body.\n\nApply a drop using the glass rod applicator directly to the inner wrists, behind the earlobes, along the collarbones, and the nape of your neck. The constant heat generated by blood vessels in these areas gently diffuses the heavy resinous molecules throughout the day.\n\nNever rub the wrists together violently, as friction breaks down delicate volatile top notes. Instead, gently dab to preserve the integrity of every botanical facet.",
		},
		{
			Title:     "Cambodian vs. Indian Assam Oud: Decoding Scent Profiles",
			Slug:      "difference-between-cambodian-and-assam-oud",
			Excerpt:   "From the sweet dried-fruit nuances of Koh Kong Agarwood to the deep, smoky balsamic depths of Assam wild trees.",
			Category:  "Master Perfumer Notes",
			ReadTime:  "6 min read",
			ImageUrl:  "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=80",
			Published: true,
			SortOrder: 5,
			Content:   "Terroir plays an extraordinary role in the distillation of Agarwood. Cambodian Oud distilled from Aquilaria Crassna trees is renowned worldwide for its sweet, honeyed apricot, and smooth wood facets.\n\nIn contrast, wild Indian Assam Oud extracted from Aquilaria Agallocha offers deep barnyard undertones, leathery richness, and mysterious balsamic smoke that defines regal majesty.\n\nUnderstanding these geographic nuances allows collectors to select the perfect profile for personal anointing or formal grand occasions.",
		},
		{
			Title:     "Why Alcohol-Free Perfume Oils Outperform Commercial Sprays",
			Slug:      "why-non-alcoholic-perfumes-last-longer",
			Excerpt:   "Commercial fragrances evaporate quickly due to 80% alcohol carriers. Discover why pure oils meld with skin heat for an intimate aroma.",
			Category:  "Science & Craft",
			ReadTime:  "5 min read",
			ImageUrl:  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80",
			Published: true,
			SortOrder: 6,
			Content:   "Mainstream commercial fragrances typically contain up to 80-90% denatured alcohol. While this creates a sudden burst of projection during the initial 15 minutes, the alcohol rapidly evaporates, dragging volatile scent molecules with it into the air.\n\nConcentrated perfume oils and pure Attars contain 0% alcohol. Their lipid-rich molecular structures bind directly to the epidermis, activating slowly in response to body warmth and lasting well past 24 hours.\n\nThis delivers an authentic, skin-intimate aura that remains luxurious from morning until deep into the night.",
		},
	}

	for i := range posts {
		db.Create(&posts[i])
	}
	log.Printf("[DB Seed] Successfully seeded %d blog posts.", len(posts))
}

func seedFAQs(db *gorm.DB) {
	var count int64
	db.Model(&models.FAQ{}).Count(&count)
	if count > 0 {
		return
	}

	log.Println("[DB Seed] Seeding FAQs into database...")

	faqs := []models.FAQ{
		// Order Enquiries
		{
			Category:  "Order Enquiries",
			Question:  "I have not received any updates/emails about my order?",
			Answer:    "Please check the Junk/Spam folder as the email could be there. If it's not there, please reach out to the team and they will resend the tracking information.",
			SortOrder: 1,
			Published: true,
		},
		{
			Category:  "Order Enquiries",
			Question:  "I am trying to place an order but the website keeps crashing?",
			Answer:    "We are working on the website from time to time. We would advise checking the website an hour later and trying again. If it does not work, email the team and they will look into this.",
			SortOrder: 2,
			Published: true,
		},
		{
			Category:  "Order Enquiries",
			Question:  "I placed an order for a product but now I do not want it, can I get a refund?",
			Answer:    "If the order has been dispatched, you will need to send it back to the office unopened in order to qualify for a refund. If your order is not yet dispatched, please contact our team so they can cancel your order.",
			SortOrder: 3,
			Published: true,
		},
		{
			Category:  "Order Enquiries",
			Question:  "I placed an order but the money has been taken from my account twice?",
			Answer:    "This is occasionally an issue with payment gateways. If you notice a duplicate charge, please contact our team with proof and we will ensure the duplicate amount is refunded promptly.",
			SortOrder: 4,
			Published: true,
		},

		// Shipping issues
		{
			Category:  "Shipping issues",
			Question:  "Why is delivery taking so long?",
			Answer:    "We use reliable courier dispatch services. Deliveries are typically completed within 1 to 3 working days in major cities, but can take up to 5 business days for distant areas.\n\nPlease check the tracking information provided in your confirmation email. If your order does not arrive within expected business days, please contact us so we can trace your package.",
			SortOrder: 5,
			Published: true,
		},
		{
			Category:  "Shipping issues",
			Question:  "It has been over a couple of weeks and my order has not been delivered, can you contact the courier?",
			Answer:    "Yes. Please reach out to our team with your order reference and we will contact the dispatch team directly to locate your package.",
			SortOrder: 6,
			Published: true,
		},
		{
			Category:  "Shipping issues",
			Question:  "My tracking information states delivered but I do not have the product?",
			Answer:    "We ask you to check with neighbours, family members, or reception to ensure it was not received on your behalf. If not, please contact our team so we can investigate with the delivery courier.",
			SortOrder: 7,
			Published: true,
		},
		{
			Category:  "Shipping issues",
			Question:  "I put the wrong address details in my order, can this be changed?",
			Answer:    "If the order has not yet been dispatched, contact us immediately and we will update the address for you. If it has already been shipped, we will need to wait for it to be returned before resending.",
			SortOrder: 8,
			Published: true,
		},
		{
			Category:  "Shipping issues",
			Question:  "Do you offer international shipping?",
			Answer:    "Yes, we do. However, there may be extra costs relating to import and customs duties which the customer will need to pay for depending on destination country policies.",
			SortOrder: 9,
			Published: true,
		},
		{
			Category:  "Shipping issues",
			Question:  "What delivery service do you offer?",
			Answer:    "We offer tracked, secure express courier delivery across Ghana and international shipping with tracking links sent by email and SMS.",
			SortOrder: 10,
			Published: true,
		},
		{
			Category:  "Shipping issues",
			Question:  "My tracking status won't update, is there something wrong with my order?",
			Answer:    "Tracking status updates when packages are scanned at delivery checkpoints. If there is no update for more than 48 hours, please contact us and our team will follow up on your delivery.",
			SortOrder: 11,
			Published: true,
		},

		// Received Incorrect Items & Returns
		{
			Category:  "Returns & Product Care",
			Question:  "Received Incorrect Items?",
			Answer:    "If you received an item different from what you ordered, please contact us within 48 hours with a picture of the items and we will send the correct items right away.",
			SortOrder: 12,
			Published: true,
		},
		{
			Category:  "Returns & Product Care",
			Question:  "How should I store my Oud perfume oils and attars?",
			Answer:    "Keep your bottles in a cool, dry place away from direct sunlight and excessive heat. When stored properly, authentic pure Oud oils age gracefully and become smoother over time.",
			SortOrder: 13,
			Published: true,
		},
	}

	for i := range faqs {
		db.Create(&faqs[i])
	}
	log.Printf("[DB Seed] Successfully seeded %d FAQs.", len(faqs))
}
