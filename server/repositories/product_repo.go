package repositories

import (
	"strings"

	"github.com/fireheart071/models"
	"gorm.io/gorm"
)

type ProductRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

type ProductFilter struct {
	CollectionSlug string
	ScentFamily    string
	Gender         string
	Concentration  string
	Search         string
	MinPrice       float64
	MaxPrice       float64
	Sort           string // "featured", "price_asc", "price_desc", "rating", "new"
}

func (r *ProductRepository) GetAll(filter ProductFilter) ([]models.Product, error) {
	query := r.db.Model(&models.Product{}).
		Preload("Collection").
		Preload("Notes").
		Preload("Variants")

	if filter.CollectionSlug != "" {
		var collection models.Collection
		if err := r.db.Where("slug = ?", filter.CollectionSlug).First(&collection).Error; err == nil {
			query = query.Where("collection_id = ?", collection.ID)
		}
	}

	if filter.ScentFamily != "" && filter.ScentFamily != "all" {
		query = query.Where("LOWER(scent_family) = ?", strings.ToLower(filter.ScentFamily))
	}

	if filter.Gender != "" && filter.Gender != "all" {
		query = query.Where("LOWER(gender) = ?", strings.ToLower(filter.Gender))
	}

	if filter.Concentration != "" && filter.Concentration != "all" {
		query = query.Where("LOWER(concentration) LIKE ?", "%"+strings.ToLower(filter.Concentration)+"%")
	}

	if filter.MinPrice > 0 {
		query = query.Where("price >= ?", filter.MinPrice)
	}

	if filter.MaxPrice > 0 {
		query = query.Where("price <= ?", filter.MaxPrice)
	}

	if filter.Search != "" {
		s := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(subtitle) LIKE ?", s, s, s)
	}

	switch filter.Sort {
	case "price_asc":
		query = query.Order("price asc")
	case "price_desc":
		query = query.Order("price desc")
	case "rating":
		query = query.Order("rating desc")
	case "new":
		query = query.Order("is_new desc, created_at desc")
	default:
		query = query.Order("is_best_seller desc, id asc")
	}

	var products []models.Product
	err := query.Find(&products).Error
	return products, err
}

func (r *ProductRepository) GetBySlug(slug string) (*models.Product, error) {
	var product models.Product
	err := r.db.Preload("Collection").
		Preload("Notes").
		Preload("Variants").
		Preload("Reviews").
		Where("slug = ?", slug).
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepository) GetByID(id uint) (*models.Product, error) {
	var product models.Product
	err := r.db.Preload("Collection").
		Preload("Notes").
		Preload("Variants").
		Preload("Reviews").
		Where("id = ?", id).
		First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepository) Create(product *models.Product) error {
	return r.db.Create(product).Error
}

func (r *ProductRepository) Save(product *models.Product) error {
	return r.db.Model(&models.Product{}).Where("id = ?", product.ID).Updates(product).Error
}

func (r *ProductRepository) Update(id uint, updates map[string]interface{}) error {
	return r.db.Model(&models.Product{}).Where("id = ?", id).Updates(updates).Error
}

func (r *ProductRepository) Delete(id uint) error {
	return r.db.Delete(&models.Product{}, id).Error
}

