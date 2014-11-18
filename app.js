$(document).ready( function() {

//Artist object that will Arist information 
function Artist(id, names, track){
	id = this.id, //Spotify ID used to pull artist info
	names = this.names, //Artist name
	tracks = this.tracks; //song by artist
	uri = this.uri; //link to artist track used in iFrame
};

artists = [
	new Artist(0,"", "", ""), 
	new Artist(0, "", "", ""), 
	new Artist(0, "", "", ""),
	new Artist(0, "", "", "")
]


$('.spotifySearch').submit( function(event){

	    $('.results').html('');
		// get the value of the artist the user submitted
		var search = $(this).find("input[name='search']").val();
		getNewMusic(search);
	});

}); /*end docuemnt ready*/


var getNewMusic = function(search){
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

     	if (result.artists.items.length == 0){
     		//if the artist searched for doesn't exist in Spotify
     		alert("Whoops! Looks like this artist doesn't exist in Spotify. Try again!");
     	}
     	else{
     		artists[0].id = getOriginalArtistID(result);
     	    artists[0].names = getOriginalArtistName(result);
        	getRelatedArtists(artists[0].id);
     	}
	 })
     .fail(function(result){
		var errorElem = showError(result);
		$('.search-results').append(errorElem);
		});
}; /*close getNewMusic*/


/*Gets top 3 related artists to the artist searched*/
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
     .fail(function(result){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
		});
};

/*Gets top track for each of the related artists*/
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

	 	var widget = showSongs(artist);
		$('.results').append(widget);
	 })
	 
     .fail(function(result){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
		});
};

/*creates the Spotify widgets with top songs for each artist*/
var showSongs = function(artist){
	
	var result = $('.templates .songs').clone();

	var songWidget = result.find('.frame');
	songWidget.attr('src', "https://embed.spotify.com/?uri=" + artist.uri);

	var title = result.find('.name');
	title.text(artist.names);

	return result;

}

/*Gets the URI for the track for the iframe*/
var getURI = function(result){
	var uri = result.tracks[0].uri;
	return uri;
}

/*Get's the artist's top track*/
var getTrack = function(result){
	var track = result.tracks[0].name;
	return track;
};

/*Pulls the Spotfiy ID of the artist searched for*/
var getOriginalArtistID = function(result){
	var id = result.artists.items[0].id;
	return id;
};

/*Gets the name of the artist searched for*/
var getOriginalArtistName = function(result){
	var artist = result.artists.items[0].name;
	return artist;
};

/*Gets the Spotify ID of the related artist*/
var getRelatedArtistID = function(result, index){
	var id = result.artists[index].id;
	return id;
};

/*Gets the name of the related artist*/
var getRelatedArtistName = function(result, index){
	var artist = result.artists[index].name;
	return artist;
};


// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

