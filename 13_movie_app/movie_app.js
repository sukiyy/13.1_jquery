// id to keep track of which element to remove (this would be better not in global scope)
let currentId = 0;

// list of all of movies in memory for sorting / repainting
let moviesList = [];

$(function() {
  $("#new-movie-form").on("submit", function(evt) {
    evt.preventDefault();
    let title = $("#title").val();
    let rating = $("#rating").val();

    let movieData = { title, rating, currentId };
    const HTMLtoAppend = createMovieDataHTML(movieData);

    currentId++
    moviesList.push(movieData);

    $("#movie-table-body").append(HTMLtoAppend);
    $("#new-movie-form").trigger("reset");
  });

  $("tbody").on("click", ".btn.btn-danger", function(evt) {
    let indexToRemoveAt = moviesList.findIndex(movie => movie.currentId === +$(evt.target).data("deleteId"))

    moviesList.splice(indexToRemoveAt, 1)

    $(evt.target)
      .closest("tr")
      .remove();
    
  });

  // when an arrow is clicked
  $(".fas").on("click", function(evt) {

    let direction = $(evt.target).hasClass("fa-sort-down") ? "down" : "up";
    let keyToSortBy = $(evt.target).attr("id");
    let sortedMovies = sortBy(moviesList, keyToSortBy, direction);

    $("#movie-table-body").empty();

    for (let movie of sortedMovies) {
      const HTMLtoAppend = createMovieDataHTML(movie);
      $("#movie-table-body").append(HTMLtoAppend);
    }

    $(evt.target).toggleClass("fa-sort-down");
    $(evt.target).toggleClass("fa-sort-up");
  });
});

// accepts an array of objects and a key and sorts by that key
function sortBy(array, keyToSortBy, direction) {
  return array.sort(function(a, b) {
    if (keyToSortBy === "rating") {
      a[keyToSortBy] = +a[keyToSortBy];
      b[keyToSortBy] = +b[keyToSortBy];
    }
    if (a[keyToSortBy] > b[keyToSortBy]) {
      return direction === "up" ? 1 : -1;
    } else if (b[keyToSortBy] > a[keyToSortBy]) {
      return direction === "up" ? -1 : 1;
    }
    return 0;
  });
}

// createMovieDataHTML accepts an object with title and rating keys and returns a string of HTML
function createMovieDataHTML(data) {
  return `
    <tr>
      <td>${data.title}</td>
      <td>${data.rating}</td>
      <td>
        <button class="btn btn-danger" data-delete-id=${data.currentId}>
          Delete
        </button>
      </td>
    <tr>
  `;
}