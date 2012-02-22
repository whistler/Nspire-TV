require 'net/http'

class Episode < ActiveRecord::Base
	belongs_to :category
	belongs_to :interviewee

	VIMEO_OMEMBED_URL = "http://vimeo.com/api/oembed.json?url="

	VIDEO_HEIGHT = "800" 
	VIDEO_WIDTH = "450"

	def get_oembed_json
		oembed = VIMEO_OMEMBED_URL + video_url + "&width=" + VIDEO_WIDTH + "&height=" + VIDEO_HEIGHT + "&title=false&portrait=false&byline=false&xhtml=true"

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
