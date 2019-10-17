class CycleRecord < ApplicationRecord
  belongs_to :user
  validates :date, presence: true, uniqueness: true
  validates :body_temperature, presence: true
  validates :body_weight, presence: true
  validates :symptom, presence: true, length: {maximum: 1000}

  # そのままデータを取り出すと，日付が不連続なデータになるため，日付が連続するデータを作成する。
  def self.chart_data(user)
    cycle_records = user.cycle_records.order(date: :asc)
    today = Date.today

     # 記録が無い場合にエラーが出るのを防止
    return [{date: today, body_temperature: nil, body_weight: nil}] if cycle_records.empty?

    start_date = cycle_records.first.date
    last_date = cycle_records.last.date
    if last_date < today
      last_date = today
    end

    period = start_date..last_date

    chart_data = []
    period.each do |date|
      cycle_record = cycle_records.find do |record|
        record.date == date
      end
      if cycle_record.present?
        chart_data << cycle_record.slice(:date, :body_temperature, :body_weight)
      else
        chart_data << {date: date, body_temperature: nil, body_weight: nil}
      end
    end
    chart_data
  end
end
