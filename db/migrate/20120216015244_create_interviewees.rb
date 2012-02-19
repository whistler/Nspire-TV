class CreateInterviewees < ActiveRecord::Migration
  def change
    create_table :interviewees do |t|
    	t.string :name
    	t.string :company
    	t.string :position
    	
      	t.timestamps
    end
  end
end
