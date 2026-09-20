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
	return r.db.Transaction(func(tx *gorm.DB) error {
		// If products belong to this collection, reassign them to another collection or cascade delete
		var fallbackCollection models.Collection
		err := tx.Where("id != ?", id).Order("id asc").First(&fallbackCollection).Error
		if err == nil && fallbackCollection.ID > 0 {
			if err := tx.Model(&models.Product{}).Where("collection_id = ?", id).Update("collection_id", fallbackCollection.ID).Error; err != nil {
				return err
			}
		} else {
			// No other collection exists, find product IDs to cascade delete
			var productIDs []uint
			if err := tx.Model(&models.Product{}).Where("collection_id = ?", id).Pluck("id", &productIDs).Error; err == nil && len(productIDs) > 0 {
				if err := tx.Where("product_id IN ?", productIDs).Delete(&models.FragranceNote{}).Error; err != nil {
					return err
				}
				if err := tx.Where("product_id IN ?", productIDs).Delete(&models.ProductVariant{}).Error; err != nil {
					return err
				}
				if err := tx.Where("product_id IN ?", productIDs).Delete(&models.Review{}).Error; err != nil {
					return err
				}
				if err := tx.Where("id IN ?", productIDs).Delete(&models.Product{}).Error; err != nil {
					return err
				}
			}
		}
		return tx.Delete(&models.Collection{}, id).Error
	})
}

