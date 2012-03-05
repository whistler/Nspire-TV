class EpisodesController < ApplicationController
	def index
		offset = rand(Episode.count - 1) + 1

		@episodes = Episode.find(:all)
		@featured = Episode.first(:offset => offset)

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
