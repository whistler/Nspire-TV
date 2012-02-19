require 'net/http'

class Episode < ActiveRecord::Base
	belongs_to :category
	belongs_to :interviewee

	VIMEO_OMEMBED_URL = "http://vimeo.com/api/oembed.json?url="

	def get_oembed_json
		oembed = VIMEO_OMEMBED_URL + video_url + "&width=550&height=300&title=false&portrait=false&byline=false&xhtml=true"

    	oembed_uri = URI.parse(oembed)

    	response_data = Net::HTTP.get_response(oembed_uri)
    	if response_data.is_a?(Net::HTTPSuccess)
    		JSON.parse(response_data.body)
    	else
    		{"html" => "", "thumbnail_url" => ""}
    	end
    	
	end

	def video_embed_html
		
		data = get_oembed_json()

		data["html"]
	end

	def video_thumbnail_url
		data = get_oembed_json()

		data["thumbnail_url"]
	end
end
