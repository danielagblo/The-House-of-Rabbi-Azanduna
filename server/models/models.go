package models

import (
	"time"
)

type Collection struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Slug        string    `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	Subtitle    string    `gorm:"size:255" json:"subtitle"`
	Description string    `gorm:"type:text" json:"description"`
	ImageUrl    string    `gorm:"size:500" json:"imageUrl"`
	Badge       string    `gorm:"size:100" json:"badge"`
	Featured    bool      `gorm:"default:false" json:"featured"`
	SortOrder   int       `gorm:"default:0" json:"sortOrder"`
	Products    []Product `gorm:"foreignKey:CollectionID" json:"products,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type FragranceNote struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	ProductID   uint   `gorm:"index;not null" json:"productId"`
	Layer       string `gorm:"size:50;not null" json:"layer"` // "top", "heart", "base"
	NoteName    string `gorm:"size:100;not null" json:"noteName"`
	Description string `gorm:"size:255" json:"description"`
}

type ProductVariant struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	ProductID uint    `gorm:"index;not null" json:"productId"`
	Size      string  `gorm:"size:50;not null" json:"size"` // "3ml", "6ml", "12ml", "50ml", "100ml"
	Price     float64 `gorm:"type:decimal(10,2);not null" json:"price"`
	InStock   bool    `gorm:"default:true" json:"inStock"`
}

type Review struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	ProductID        uint      `gorm:"index;not null" json:"productId"`
	AuthorName       string    `gorm:"size:100;not null" json:"authorName"`
	Rating           int       `gorm:"not null" json:"rating"`
	Title            string    `gorm:"size:255" json:"title"`
	Comment          string    `gorm:"type:text" json:"comment"`
	VerifiedPurchase bool      `gorm:"default:true" json:"verifiedPurchase"`
	CreatedAt        time.Time `json:"createdAt"`
}

type Product struct {
	ID              uint             `gorm:"primaryKey" json:"id"`
	CollectionID    uint             `gorm:"index" json:"collectionId"`
	Collection      *Collection      `gorm:"foreignKey:CollectionID" json:"collection,omitempty"`
	Name            string           `gorm:"size:255;not null" json:"name"`
	Slug            string           `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	Subtitle        string           `gorm:"size:255" json:"subtitle"`
	Description     string           `gorm:"type:text" json:"description"`
	Concentration   string           `gorm:"size:100;not null" json:"concentration"` // "Pure Perfume Oil", "Extrait de Parfum", "Attar"
	ScentFamily     string           `gorm:"size:100;not null" json:"scentFamily"`   // "Oud", "Woody", "Amber", "Floral", "Oriental", "Gourmand", "Fresh Spicy"
	Gender          string           `gorm:"size:50;default:'Unisex'" json:"gender"` // "Unisex", "For Him", "For Her"
	Sillage         string           `gorm:"size:100;default:'Strong'" json:"sillage"`
	Longevity       string           `gorm:"size:100;default:'12+ Hours'" json:"longevity"`
	Price           float64          `gorm:"type:decimal(10,2);not null" json:"price"`
	CompareAtPrice  float64          `gorm:"type:decimal(10,2)" json:"compareAtPrice"`
	ImageUrl        string           `gorm:"size:500;not null" json:"imageUrl"`
	HoverImageUrl   string           `gorm:"size:500" json:"hoverImageUrl"`
	Rating          float64          `gorm:"type:decimal(3,2);default:5.0" json:"rating"`
	ReviewCount     int              `gorm:"default:0" json:"reviewCount"`
	IsBestSeller    bool             `gorm:"default:false" json:"isBestSeller"`
	IsNew           bool             `gorm:"default:false" json:"isNew"`
	InStock         bool             `gorm:"default:true" json:"inStock"`
	Notes           []FragranceNote  `gorm:"foreignKey:ProductID" json:"notes"`
	Variants        []ProductVariant `gorm:"foreignKey:ProductID" json:"variants"`
	Reviews         []Review         `gorm:"foreignKey:ProductID" json:"reviews,omitempty"`
	CreatedAt       time.Time        `json:"createdAt"`
	UpdatedAt       time.Time        `json:"updatedAt"`
}

type OrderItem struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	OrderID     uint    `gorm:"index;not null" json:"orderId"`
	ProductID   uint    `gorm:"not null" json:"productId"`
	ProductName string  `gorm:"size:255;not null" json:"productName"`
	VariantSize string  `gorm:"size:50;not null" json:"variantSize"`
	Quantity    int     `gorm:"not null" json:"quantity"`
	UnitPrice   float64 `gorm:"type:decimal(10,2);not null" json:"unitPrice"`
	ImageUrl    string  `gorm:"size:500" json:"imageUrl"`
}

type Order struct {
	ID             uint        `gorm:"primaryKey" json:"id"`
	Reference      string      `gorm:"size:100;uniqueIndex;not null" json:"reference"`
	PaystackRef    string      `gorm:"size:100" json:"paystackRef"`
	CustomerName   string      `gorm:"size:255;not null" json:"customerName"`
	CustomerEmail  string      `gorm:"size:255;not null" json:"customerEmail"`
	CustomerPhone  string      `gorm:"size:50" json:"customerPhone"`
	ShippingStreet string      `gorm:"size:255" json:"shippingStreet"`
	ShippingCity   string      `gorm:"size:100" json:"shippingCity"`
	ShippingState  string      `gorm:"size:100" json:"shippingState"`
	ShippingZip    string      `gorm:"size:50" json:"shippingZip"`
	ShippingCountry string     `gorm:"size:100;default:'Ghana'" json:"shippingCountry"`
	TotalAmount    float64     `gorm:"type:decimal(10,2);not null" json:"totalAmount"`
	Currency       string      `gorm:"size:10;default:'GHS'" json:"currency"`
	Status         string      `gorm:"size:50;default:'pending'" json:"status"` // "pending", "paid", "shipped", "failed"
	Items          []OrderItem `gorm:"foreignKey:OrderID" json:"items"`
	CreatedAt      time.Time   `json:"createdAt"`
	UpdatedAt      time.Time   `json:"updatedAt"`
}
