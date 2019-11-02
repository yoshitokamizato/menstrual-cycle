module MovieHelper
  def movie(options)
    content_tag(
        :iframe,
        '',
        width: 560,
        height: 315,
        src: "https://www.youtube.com/embed/#{options[:movie_id]}",
        frameborder: 0,
        allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
        allowfullscreen: true
    )
  end
end
