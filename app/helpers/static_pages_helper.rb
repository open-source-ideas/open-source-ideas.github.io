require 'redcarpet/render_strip'

module StaticPagesHelper
  def md_strip(md_content)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::StripDown)
    result = markdown.render(md_content).sub!(/^Project description\s/, '')
    result.length > 280 ? "#{result[0...280]}..." : result
  end
end
