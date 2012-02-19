class EpisodesController < ApplicationController
	def index
		@episodes = Episode.find(:all)
		@featured = @episodes.last

		respond_to do |f|
			f.html
		end
	end

	def show
		@episodes = Episode.find(:all)
		@featured = Episode.find(params[:id])

		render 'index'
	end
end
