class User < ApplicationRecord
  validates :name, uniqueness: true, length: { minimum: 2, maximum: 40 }
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # :registerable 新規登録を不可能にする
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :cycle_records, dependent: :destroy
  has_many :meals
  has_many :exercises
end
