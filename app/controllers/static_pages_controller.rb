class StaticPagesController < ApplicationController
  def index
    @issues = IssuesWrapper.get_issues
  end
end
