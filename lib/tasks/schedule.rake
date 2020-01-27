namespace :schedule do
  desc 'スケジューラー用'

  task destroy_monologues: :environment do
    TIME_AGO = 7.days
    # TIME_AGO 前までの独り言を全て削除する
    Monologue.where(created_at: Time.at(0)..(Time.now - TIME_AGO)).destroy_all
    puts 'スケジュールを実行しました'
  end
end
