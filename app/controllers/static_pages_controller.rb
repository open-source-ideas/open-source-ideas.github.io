class StaticPagesController < ApplicationController
  def index
    @issues = get_issues
  end

  private

  ISSUE_PATH = 'https://api.github.com/repos/mikaelbr/open-source-ideas/issues'.freeze

  def get_issues(labels = [])
    all_issues_json = JSON.parse(Net::HTTP.get(URI(ISSUE_PATH)))

    filtered_issues = []

    all_issues_json.each do |i|
      if i['labels'].any? && labels.any?
        i_labels = i['labels'].map { |l| l['name'] }
        filtered_issues << i if (i_labels - labels).empty?
      else
        filtered_issues << i
      end
    end
  end
end
