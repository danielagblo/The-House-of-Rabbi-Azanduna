package repositories

import (
	"github.com/fireheart071/models"
	"gorm.io/gorm"
)

type CollectionRepository struct {
	db *gorm.DB
}

func NewCollectionRepository(db *gorm.DB) *CollectionRepository {
	return &CollectionRepository{db: db}
}

func (r *CollectionRepository) GetAll() ([]models.Collection, error) {
	var collections []models.Collection
	err := r.db.Order("sort_order asc").Preload("Products.Variants").Find(&collections).Error
	return collections, err
}

func (r *CollectionRepository) GetBySlug(slug string) (*models.Collection, error) {
	var collection models.Collection
	err := r.db.Preload("Products.Notes").Preload("Products.Variants").Where("slug = ?", slug).First(&collection).Error
	if err != nil {
		return nil, err
	}
	return &collection, nil
}
