package repositories

import (
	"github.com/fireheart071/models"
	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *OrderRepository) GetByReference(reference string) (*models.Order, error) {
	var order models.Order
	err := r.db.Preload("Items").Where("reference = ?", reference).First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *OrderRepository) GetAll() ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Preload("Items").Order("created_at desc").Find(&orders).Error
	return orders, err
}

func (r *OrderRepository) UpdateStatus(reference string, status string, paystackRef string) error {
	return r.db.Model(&models.Order{}).
		Where("reference = ?", reference).
		Updates(map[string]interface{}{
			"status":       status,
			"paystack_ref": paystackRef,
		}).Error
}
