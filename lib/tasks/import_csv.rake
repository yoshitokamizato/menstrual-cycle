require 'csv'

namespace :import_csv do
  desc "CSVデータをインポートするタスク"

  task cycle_records: :environment do
    path = File.join Rails.root, "db/csv_data/cycle_records.csv"
    list = []
    CSV.foreach(path, headers: true) do |row|
      list << {
          user_id: row["user_id"],
          date: row["date"],
          body_temperature: row["body_temperature"],
          body_weight: row["body_weight"],
          symptom: row["symptom"]
      }
    end
    puts "インポート処理を開始"
    begin
      CycleRecord.create!(list)
      puts "インポート完了!!"
    rescue ActiveModel::UnknownAttributeError => invalid
      puts "インポートに失敗：UnknownAttributeError"
    end
  end
end