$(document).ready(function() {
	
	function movieDetail(movie){
		const html = `
			<div>
				<h1 style="font-size: 40px" >${movie.title}</h1>
				<p>${movie.director} | ${movie.year} | <i class="fa-solid fa-star" style="color: rgb(255, 204, 0);"></i>&nbsp;${movie.rating}</i></p> 
			</div>
			
			<div id="vid" style="margin-bottom: 1%;">
				<img src=${movie.link} alt="">
				<iframe width="663.03px" height="372.95px" src=${movie.vlink} frameborder="0" allow="autoplay; encrypted-media" ></iframe>
			</div>

			<div>
				<small>${movie.genre}</small>
				
			</div>

			<p class="info">
			${movie.info}
			</p>
			
			<P>Creator: ${movie.director}</P>
			<p>Cast: ${movie.cast}</p>
			
		`;

		return html;
	}

	

	$.ajax({
		type: "GET",
		url: "movie.xml", 
		dataType: "xml",
		success: function(xml) { 
			let movies = [];
			let c=0;
			
			$(xml).find('movie').each(function() {
				c+=1;
				const title = $(this).find('title').text();
				const index = $(this).find('index').text();
				const link = $(this).find('ilink').text();
				const vlink = $(this).find('vlink').text();
				const info = $(this).find('info').text();
				const cast = $(this).find('cast').text();
				const year = $(this).find('year').text();
				const director = $(this).find('director').text();
				const genre = $(this).find('genre').text();
				const rating = $(this).find('rating').text();

				movies.push({ title,index, link,vlink,info,cast, year, director, genre, rating });

				$('#movie-list').append(`<div class="movie" data-index="${c - 1}">
					<img src=${link}>
					<span><i class="fa-solid fa-star" style="color: yellow;"></i>&nbsp;&nbsp;${rating} </span>
					<h2 class="title" style="font-size: 22px;">${title}</h2>
					<span class="yg" style="margin-top: 0; color: rgb(200, 200, 200);">${year}</span>
					<span class="yg" style="margin-top: 0; color: rgb(200, 200, 200);">${genre}</span>
				</div>`);
			});

			let movie_rating = [...movies].sort((a, b) => b.rating - a.rating); 
            let movie_year = [...movies].sort((a, b) => b.year - a.year);

			$('#sortby').on('change',function(){
				c=0;
				let value = $('#sortby').val();
				console.log(value);
				let x = (value == 'Rating') ? movie_rating : (value == 'Year' ? movie_year : movies);
				console.log(x)
				$('#movie-list').empty();
				x.forEach(function(a){
					c+=1
					$('#movie-list').append(`<div class="movie" data-index="${c - 1}">
					<img src=${a.link}>
					
					<span><i class="fa-solid fa-star" style="color: yellow;"></i>&nbsp;&nbsp;${a.rating} </span>
					<h2 class="title">${a.title}</h2>
					<span class="yg" style="margin-top: 0; color: rgb(200, 200, 200);">${a.year}</span>
					<span class="yg" style="margin-top: 0; color: rgb(200, 200, 200);">${a.genre}</span>
					
				</div>`)
					
				})

				
			})

			$('#home','#imdb').on('click',function(event){
				event.preventDefault();

				$('#movie-list').css('display','grid');
				
				$('#movie-detail').empty();
				$('#movie-detail').css('display','none');
			})

			$('#search').on('keyup', function(){
				console.log('typed')
				let input = $('#search').val().toLowerCase();

				if(input.trim() ===""){
					$('#dropdown').css('display','none');

				}
				else{
					

					let matches = movies.filter(function(movie){
						return movie.title.toLowerCase().includes(input) || 
						movie.director.toLowerCase().includes(input) ||
						movie.genre.toLowerCase().includes(input);
					})

					if(matches.length==0){
						$('#dropdown').css('display','none');
					}
					else{
						$('#dropdown').empty();

					$('#dropdown').css('display','flex');

					matches.forEach((movie)=>{
						$('#dropdown').append(`<div class="dropdownItem">
								${movie.title}
							</div>`);
					})
					}

				

					
				}

			})

			$(document).on('click', '.dropdownItem', function(event) {
				event.preventDefault();
				console.log('clickeditem'+$(this).text())

				let mtitle = $(this).text().trim().toLowerCase();

				let index = movies.findIndex(movie => movie.title.toLowerCase() === mtitle.toLowerCase());
				
				if (index >= 0) {
					
					let movie = movies[index];
					
					const html = movieDetail(movie);
					
					
					$('#movie-list').css('display', 'none');
					$('#sort').css('display', 'none');
					$('#movie-detail').html(html);
					$('#dropdown').css('display', 'none');
				}


			})

			$('#enter').on('click', function(event) {
				
				event.preventDefault();
				console.log('clicked')
				
				
				let searchQuery = $('#search').val(); 
				
				
				let index = movies.findIndex(movie => movie.title.toLowerCase() === searchQuery.toLowerCase());
				
				if (index >= 0) {
					
					let movie = movies[index];
					
					
					const html = movieDetail(movie);
					
					
					$('#movie-list').css('display', 'none');
					$('#sort').css('display', 'none');
					$('#movie-detail').html(html);
				} else {
					
					alert("No such movie exists.");
				}
			});

			
			

			
			$(document).on('click', '.movie', function() {
				
				const mtitle = $(this).children('h2').text();
				console.log(mtitle);
				let index = movies.findIndex(movie => movie.title.toLowerCase() === mtitle.toLowerCase());
				const movie = movies[index];

				const html = movieDetail(movie);

				$('#movie-list').css('display','none');
				$('#sort').css('display', 'none');
				$('#movie-detail').css('display','block');
				$('#movie-detail').html(html);
			});
		}, 

		error: function() { 
			$('#movie-list').append('<li>Error loading movie data.</li>');
		} 
	}); 
}); 
