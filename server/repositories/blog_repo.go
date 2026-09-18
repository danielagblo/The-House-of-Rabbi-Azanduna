package repositories

import (
	"github.com/fireheart071/models"
	"gorm.io/gorm"
)

type BlogRepository struct {
	db *gorm.DB
}

func NewBlogRepository(db *gorm.DB) *BlogRepository {
	return &BlogRepository{db: db}
}

func (r *BlogRepository) GetAll() ([]models.BlogPost, error) {
	var posts []models.BlogPost
	err := r.db.Where("published = ?", true).Order("sort_order asc, created_at desc").Find(&posts).Error
	return posts, err
}

func (r *BlogRepository) GetBySlug(slug string) (*models.BlogPost, error) {
	var post models.BlogPost
	err := r.db.Where("slug = ? AND published = ?", slug, true).First(&post).Error
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *BlogRepository) Create(post *models.BlogPost) error {
	return r.db.Create(post).Error
}

func (r *BlogRepository) Update(id uint, updates map[string]interface{}) error {
	return r.db.Model(&models.BlogPost{}).Where("id = ?", id).Updates(updates).Error
}

func (r *BlogRepository) Delete(id uint) error {
	return r.db.Delete(&models.BlogPost{}, id).Error
}
