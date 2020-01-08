if Rails.env.production?
  CarrierWave.configure do |config|
    config.storage :fog
    config.fog_provider = 'fog/aws'
    config.fog_directory     = ENV['S3_BUCKET']
    config.fog_credentials = {
      :provider              => 'AWS',
      :region                =>  ENV['S3_REGION'],
      :aws_access_key_id     =>  ENV['S3_ACCESS_KEY'],
      :aws_secret_access_key =>  ENV['S3_SECRET_KEY']
    }
  end
end