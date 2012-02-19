class CreateEpisodes < ActiveRecord::Migration
  def change
    create_table :episodes do |t|
    	t.string :title
    	t.string :description
    	t.string :video_url

		t.integer :category_id #belongs_to
		t.integer :interviewee_id #has_one
		    	
		t.timestamps
    end
  end
end
