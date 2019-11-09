module MovieHelper
  def movie(options)
    url = options[:url]
    pattern = /\A.*\/(?:watch\?)?(?:v=)?(?:feature=[a-z_]+&)?(?:v=)?([a-zA-Z0-9=_-]+)(?:&feature=[a-z_]*)?(?:\?t=[0-9]+)?\z/
    matched = url.match(pattern)
    if matched.present?
      video_id = matched[1]
      content_tag(
          :iframe,
          '',
          width: 560,
          height: 315,
          class: 'youtube embed-responsive-item',
          data: {src: "https://www.youtube.com/embed/#{video_id}"},
          frameborder: 0,
          allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: true
      )
    else
      'URLに問題があります。'
    end
  end
end
