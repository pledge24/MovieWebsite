import options from "./apikey.js";

const $cardList = document.querySelector(".card-list");
const $searchButton = document.querySelector("#search-btn");
const $searchInputText = document.querySelector("#search-input");
const $prevButton = document.querySelector("#prev-btn");
const $nextButton = document.querySelector("#next-btn");
const $bottomButtonList = document.querySelectorAll(".bottom-elem");

let movieList;
let movieConfig;
let pageNo = 1;

let init = false;

// 웹페이지 처음 진입 시 실행
if (!init) {

  // base_url가져옴
  fetch('https://api.themoviedb.org/3/configuration', options)
    .then(response => response.json())
    .then(response => {
      movieConfig = response.images;
      //console.log(response);

      // 영화 정보 가져옴
      fetch(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=${pageNo}`, options)
        .then(response => response.json())
        .then(response => {
          movieList = response;
          createMovieCards();
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));

  // 페이지 버튼에 이벤트 추가
  $bottomButtonList.forEach(btn => {
    btn.addEventListener("click", function () {
      console.log(btn.textContent);
      
      let _nextPageNO = Number(btn.textContent);
      setPages(_nextPageNO);
    })
  })

  init = true;
}

// 해당 페이지의 영화 목록을 카드로 가져오는 함수
// nextPageNO: 이동할 페이지 번호
function setPages(nextPageNO) {
  // 기존에 있던 카드들 전부 삭제
  while ($cardList.hasChildNodes()) {
    $cardList.removeChild($cardList.firstChild);
  }

  // 페이지 버튼 번호 재설정
  let _newPageNO = nextPageNO - 2 > 1 ? nextPageNO - 2 : 1; 
  $bottomButtonList.forEach(btn => {
    btn.textContent = _newPageNO;
    if(_newPageNO === nextPageNO){
      btn.style = "color : red";
    }
    else{
      btn.style = "color : white";
    }
    _newPageNO++;
  })
  pageNo = nextPageNO;

  // 다음 페이지 영화카드 추가
  fetch(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=${pageNo}`, options)
    .then(response => response.json())
    .then(response => {
      movieList = response;
      createMovieCards();
    })
    .catch(err => console.error(err));
  
}

// 이전 페이지 버튼 클릭 이벤트 추가
$prevButton.addEventListener("click", function () {
  if (pageNo <= 1) {
    alert("맨 처음 페이지입니다.");
    return;
  }

  let _nextPageNO = pageNo - $bottomButtonList.length >= 1 ? pageNo - $bottomButtonList.length : 1;

  setPages(_nextPageNO);

})

// 다음 페이지 버튼 클릭 이벤트 추가
$nextButton.addEventListener("click", function () {

  let _nextPageNO = pageNo + 5;
  setPages(_nextPageNO);
})

// 웹페이지 시작 시 카드 생성
function createMovieCards() {
  let temp_card;

  movieList.results.forEach(movie => {

    const _cardContainer = document.createElement('div');
    _cardContainer.setAttribute("class", "card-container");

    let _fullUrl = movieConfig.base_url + movieConfig.poster_sizes[4] + movie.poster_path;

    temp_card = `
      <div class="movie-card" id=${movie.id}>
        <img src=${_fullUrl} alt=${movie.original_title}>
        <h3 class="movie-title">${movie.original_title}</h3>
        <p>${movie.overview}</p>
        <br>
        <div class="movie-rate">
          <b>평점: ${Number(movie.vote_average).toFixed(2)}</b>
        </div>
      </div>
    `;

    _cardContainer.innerHTML = temp_card;

    const _card = _cardContainer.querySelector('.movie-card');

    _card.addEventListener('click', function () {
      alert("영화 id: " + _card.id);
    });

    // 마우스가 각 카드 범위에서 움직였을 때 발생하는 이벤트
    _cardContainer.addEventListener('mousemove', function (e) {
      let x = e.offsetX;
      let y = e.offsetY;
      
      let rotateY = (-150 + x) * 2 / 15;
     
      _card.style = `transform : perspective(500px) rotateY(${rotateY}deg) `;
   
    })

    // 마우스가 각 카드 범위를 벗어났을 때 발생하는 이벤트
    _cardContainer.addEventListener('mouseleave', function (e) {

      _card.style = `
        transition: transform 1s ease;
        transform: rotateY(0deg);
      `;

    })

    // 해당 카드를 카드 리스트에 추가
    $cardList.appendChild(_cardContainer);

  });
}

// 영화 검색 함수
function searchMovies() {
  let _cards = $cardList.querySelectorAll('.movie-card')

  const search_text = $searchInputText.value;
  _cards.forEach(movie_card => {
    let movie_name = movie_card.querySelector('.movie-title').textContent;

    // 전부 소문자로 변경.
    let movie_name_lower = movie_name.toLowerCase();
    let search_text_lower = search_text.toLowerCase();

    // 검색한 문자열이 있으면 해당 카드를 제외하고 display 전부 끈다. 
    if (movie_name_lower.search(search_text_lower) !== -1) {

      console.log(`I found this movie: ${movie_name}`);
      movie_card.parentElement.style.display = 'block';
    }
    else {
      movie_card.parentElement.style.display = 'none';
    }
  });

  // ---확인용---
  // alert(`내가 입력한 내용은 바로 ${search_text}인 것이다!`);
}


// 검색 버튼 클릭 시 검색 함수 호출
$searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("버튼 이벤트");
  searchMovies();
});

// 엔터 시 검색 함수 호출
$searchInputText.addEventListener("keyup", function (e) {
  // keycode가 13(엔터키 코드)이면 검색 함수 호출
  if (e.keyCode === 13) {
    e.preventDefault();
    console.log("엔터");
    searchMovies();
  }
  else {
    console.log("다른거");
    searchMovies();
  }
});

