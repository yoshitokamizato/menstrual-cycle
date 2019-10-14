User.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password', name: '管理者', flag: true)
periodic_record_list = [
    [user_id: '1', date: '2019-10-10', body_temperature: '37.7', body_weight: '46.7', symptom: '風邪気味'],
    [user_id: '1', date: '2019-10-11', body_temperature: '36.8', body_weight: '47.3', symptom: 'よくなった'],
    [user_id: '1', date: '2019-10-12', body_temperature: '36.3', body_weight: '49.2', symptom: 'OK'],
    [user_id: '1', date: '2019-10-13', body_temperature: '36.5', body_weight: '48.1', symptom: 'OK'],
]
PeriodicRecord.create!(periodic_record_list)