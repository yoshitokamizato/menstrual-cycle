class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick
  process resize_to_fit: [400, 200]
  process convert: 'jpg'

  if Rails.env.production?
    storage :fog
  else
    storage :file
  end

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  def extension_whitelist
    %W[jpg jpeg gif png]
  end
end
