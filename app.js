$(document).ready( function() {

id = new Array();
names = new Array();
tracks = new Array();

function Artist(id, names, track){
	id = this.id, 
	names = this.names, 
	tracks = this.tracks;
	uri = this.uri;
};

artists = [
	new Artist(0,"", "", ""), 
	new Artist(0, "", "", ""), 
	new Artist(0, "", "", ""),
	new Artist(0, "", "", "")
]


$('.spotifySearch').submit( function(event){
		// get the value of the artist the user submitted
		var search = $(this).find("input[name='search']").val();
		getNewMusic(search);
	});

}); /*end docuemnt ready*/



var getNewMusic = function(search){
 /*artist's ids - original artist first, then 3 recommended artists*/

// the parameters we need to pass in our request to Spotify's API 
//to get the artist's ID
	var request = {q: search,
					type: 'artist',
					limit: 1,};

	var result = $.ajax({
		url: "https://api.spotify.com/v1/search?q=" + request.q + "&type=" + request.type,
		data: request,
		dataType: "json",
		type: "GET",
		})				
     .done(function(result){
     	artists[0].id = getOriginalArtistID(result);
     	artists[0].names = getOriginalArtistName(result);
     
     	getRelatedArtists(artists[0].id);
   
	 })
     .fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
		});


}; /*close getNewMusic*/

var getRelatedArtists = function(artist){

	var request = {id: artist
				   };
	var result = $.ajax({
		url: "https://api.spotify.com/v1/artists/" + request.id + "/related-artists",
		data: request,
		dataType: "json",
		type: "GET",
		})	
	 .done(function(result){
	 	
     	for (i = 1; i<4; i++){
     		artists[i].id = getRelatedArtistID(result, i);
     	    artists[i].names = getRelatedArtistName(result, i);
     	}

     	for (i=1; i < 4; i++){
     	    getRelatedTracks(artists[i]);
     	}
     	
     	
	 })
     .fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
		});


};


var getRelatedTracks = function(artist){
	var request = {id: artist.id,
				country: 'US',
				   };
	var result = $.ajax({
		url: "https://api.spotify.com/v1/artists/" + request.id+ "/top-tracks?country=US",
		data: request,
		dataType: "json",
		type: "GET",
		})	
	 .done(function(result){
	 	artist.tracks = getTrack(result);
	 	artist.uri = getURI(result);

	 	console.log(artist);

	 	var widget = showSongs(artist);
		$('.results').append(widget);

	 


	 })
	 
     .fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
		});
};


var showSongs = function(artist){
	
	var result = $('.templates .songs').clone();
	var songWidget = result.find('.frame');
	songWidget.attr('src', "https://embed.spotify.com/?uri=" + artist.uri);
	console.log(artist.uri);

	return result;

}

var getURI = function(result){
	var uri = result.tracks[0].uri;
	return uri;
}

var getTrack = function(result){
	var track = result.tracks[0].name;
	return track;
};

var getOriginalArtistID = function(result){
	var id = result.artists.items[0].id;
	return id;
};

var getOriginalArtistName = function(result){
	var artist = result.artists.items[0].name;
	return artist;
};

var getRelatedArtistID = function(result, index){
	var id = result.artists[index].id;
	return id;
};

var getRelatedArtistName = function(result, index){
	var artist = result.artists[index].name;
	return artist;
};

var getTracks = function(result){
	var track = result.tracks.album[0].name;
	console.log(track);
}



// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

