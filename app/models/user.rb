class User < ApplicationRecord
  validates :name, uniqueness: true, length: { minimum: 2, maximum: 40 }
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # :registerable 新規登録を不可能にする
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :cycle_records, dependent: :destroy
  has_many :meals, dependent: :destroy
  has_many :exercises, dependent: :destroy
  has_many :monologues, dependent: :destroy

  # 利用者フラグ(flag)が false ならばログインできないように変更
  def active_for_authentication?
    super && self.flag?
  end

  # 利用者フラグ(flag)が false ならば ログインしようとしたときのメッセージを変更
  def inactive_message
    self.flag ? super : :message_that_flag_is_false
  end
end
