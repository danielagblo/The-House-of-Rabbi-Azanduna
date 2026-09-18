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

func (r *CollectionRepository) GetByID(id uint) (*models.Collection, error) {
	var collection models.Collection
	err := r.db.Preload("Products").Where("id = ?", id).First(&collection).Error
	if err != nil {
		return nil, err
	}
	return &collection, nil
}

func (r *CollectionRepository) Create(collection *models.Collection) error {
	return r.db.Create(collection).Error
}

func (r *CollectionRepository) Save(collection *models.Collection) error {
	return r.db.Model(&models.Collection{}).Where("id = ?", collection.ID).Updates(collection).Error
}

func (r *CollectionRepository) Update(id uint, updates map[string]interface{}) error {
	return r.db.Model(&models.Collection{}).Where("id = ?", id).Updates(updates).Error
}

func (r *CollectionRepository) Delete(id uint) error {
	return r.db.Delete(&models.Collection{}, id).Error
}

