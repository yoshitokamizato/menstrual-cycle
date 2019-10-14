class User < ApplicationRecord
  has_many :periodic_records
  validates :name, presence: true, uniqueness: true, length: { minimum: 2, maximum: 40 }
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
end
