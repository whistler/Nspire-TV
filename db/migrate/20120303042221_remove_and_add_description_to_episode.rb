class RemoveAndAddDescriptionToEpisode < ActiveRecord::Migration
	def change
		change_column :episodes, :description, :text
	end
end
