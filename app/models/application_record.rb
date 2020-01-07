class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def picture_size
    if image.size > 5.megabytes
      errors.add(:picture, "should be less than 5MB")
    end
  end
end
