class ColumnsController < ApplicationController
  def index
    @columns = Column.recent.page(params[:page]).per(5)
  end
end
