package seeds

import (
	"log"

	"github.com/fireheart071/models"
	"gorm.io/gorm"
)

func SeedDatabase(db *gorm.DB) {
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
	}

	for i := range products {
		db.Create(&products[i])
	}

	log.Printf("[DB Seed] Successfully seeded %d collections and %d luxury fragrances.", len(collections), len(products))
}
