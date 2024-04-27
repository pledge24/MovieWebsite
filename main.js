import options from "../Movie Website/apikey.js";

const $cardList = document.querySelector(".card-list");
const $searchButton = document.querySelector("#search-btn");
const $searchInputText = document.querySelector("#search-input");

let movie_list;
let details;

fetch('https://api.themoviedb.org/3/configuration', options)
  .then(response => response.json())
  .then(response => {
    details = response.images;
    //console.log(response);
  })
  .catch(err => console.error(err));

fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
  .then(response => response.json())
  .then(response => {
    movie_list = response; 
    createMovieCards();
  })
  .catch(err => console.error(err));

// 웹페이지 시작 시 카드 생성
function createMovieCards(){
  let temp_html;
  movie_list.results.forEach(movie => {

    const _cardContainer = document.createElement('div');
    _cardContainer.setAttribute("class", "movie-card");
    _cardContainer.setAttribute("id", `${movie.id}`);
    _cardContainer.addEventListener('click', function () {
      alert("영화 id: " + this.id);
    });

    let Full_url = details.base_url + details.poster_sizes[4] + movie.poster_path;

    temp_html = `
        <img src=${Full_url} alt=${movie.original_title}>
        <h3 class="movie-title">${movie.original_title}</h3>
        <p>${movie.overview}</p>
        <p>Rating: ${movie.vote_average}</p>
    `;

    _cardContainer.innerHTML = temp_html;

    $cardList.appendChild(_cardContainer);

  });
}

// 영화 검색 함수
function searchMovies(){
  let cards = $cardList.querySelectorAll('.movie-card')

  const search_text = $searchInputText.value;
  cards.forEach(movie_card =>{
    let movie_name = movie_card.querySelector('.movie-title').textContent;
    
    // 전부 소문자로 변경.
    let movie_name_lower = movie_name.toLowerCase();
    let search_text_lower = search_text.toLowerCase();

    // 검색한 문자열이 있으면 해당 카드를 제외하고 display 전부 끈다. 
    if(movie_name_lower.search(search_text_lower) !== -1){

      console.log(`I found this movie: ${movie_name}`);
      movie_card.style.display = 'block';
    }
    else{
      movie_card.style.display = 'none';
    }
  });

  // ---확인용---
  // alert(`내가 입력한 내용은 바로 ${search_text}인 것이다!`);
}


// 검색 버튼 클릭 시 검색 함수 호출
$searchButton.addEventListener("click", function (e){
  e.preventDefault();
  console.log("버튼 이벤트");
  searchMovies();
});

// 엔터 시 검색 함수 호출
$searchInputText.addEventListener("keyup", function (e){ 
  // keycode가 13(엔터키 코드)이면 검색 함수 호출
  if(e.keyCode === 13){
    e.preventDefault();
    console.log("엔터");
    searchMovies();
  }
  else{
    console.log("다른거");
  }
});

