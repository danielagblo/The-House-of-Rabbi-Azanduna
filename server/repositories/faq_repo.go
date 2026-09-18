package repositories

import (
	"github.com/fireheart071/models"
	"gorm.io/gorm"
)

type FAQRepository struct {
	db *gorm.DB
}

func NewFAQRepository(db *gorm.DB) *FAQRepository {
	return &FAQRepository{db: db}
}

func (r *FAQRepository) GetAll() ([]models.FAQ, error) {
	var faqs []models.FAQ
	err := r.db.Where("published = ?", true).Order("sort_order asc, id asc").Find(&faqs).Error
	return faqs, err
}

func (r *FAQRepository) GetAllAdmin() ([]models.FAQ, error) {
	var faqs []models.FAQ
	err := r.db.Order("sort_order asc, id asc").Find(&faqs).Error
	return faqs, err
}

func (r *FAQRepository) GetByID(id uint) (*models.FAQ, error) {
	var faq models.FAQ
	err := r.db.Where("id = ?", id).First(&faq).Error
	if err != nil {
		return nil, err
	}
	return &faq, nil
}

func (r *FAQRepository) Create(faq *models.FAQ) error {
	return r.db.Create(faq).Error
}

func (r *FAQRepository) Update(id uint, updates map[string]interface{}) error {
	return r.db.Model(&models.FAQ{}).Where("id = ?", id).Updates(updates).Error
}

func (r *FAQRepository) Delete(id uint) error {
	return r.db.Delete(&models.FAQ{}, id).Error
}
