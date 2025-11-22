let dataContainer = document.getElementById("dataContainer");
let listHeader = document.getElementById("listHeader");
let search = document.getElementById("txtSearch").value;
let resultContainer = document.getElementById("resultContainer");

const API_KEY = "f60eb7d2";

function getAllResults(type) {
    dataContainer.innerHTML = "";
    resultContainer.classList.add("d-none");

    if (type == "movie") {
        listHeader.innerText = "Latest Movies"
    } else {
        listHeader.innerHTML = "Latest TV Series"
    }

    const keywords = ["action", "horror", "love"];
    for (let i = 0; i < keywords.length; i++) {

        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&y=2025&s=${keywords[i]}&type=${type}`)
            .then(res => res.json())
            .then(data => {

                const defaultImage = 'assets/img/default.jpg';
                const results = data.Search;

                for (let i = 0; i < results.length; i++) {
                    let card = `
                <!-- Card -->
                    <div class="col-md-4 col-lg-3 mb-4">
                        <div class="card bg-dark text-white h-100 shadow-lg d-flex flex-column">
                            <img src="${results[i].Poster != "N/A" ? results[i].Poster : defaultImage}"
                                class="card-img-top" alt="Movie Poster" style="height: 400px; object-fit: cover;">
                            <div class="card-body d-flex flex-column justify-content-end flex-grow-1">
                                <div class="mt-auto">
                                    <h5 class="card-title fw-bold">${results[i].Title}</h5>
                                    <div class="mb-2">
                                        <span class="badge bg-danger">2025</span>
                                    </div>
                                    <div class="d-flex justify-content-end align-items-center">
                                        <button class="btn btn-sm btn-secondary">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Card end -->
            `;
                    dataContainer.innerHTML += card;
                }
            });
    }
}

function getSuggestResults(keyword) {
    dataContainer.innerHTML = "";

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&y=2025&s=${keyword}`)
        .then(res => res.json())
        .then(data => {

            if (!data.Search || data.Search.length === 0) {
                dataContainer.innerHTML = `<div class="alert alert-warning">No results found for "${keyword}"</div>`;
                return;
            }

            listHeader.innerText = `Suggested from "${keyword}"`;

            const defaultImage = 'assets/img/default.jpg';
            const results = data.Search;

            results.forEach(movie => {
                const poster = movie.Poster !== "N/A" ? movie.Poster : defaultImage;

                let card = `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card bg-dark text-white h-100 shadow-lg d-flex flex-column">
                        <img src="${poster}" class="card-img-top" alt="${movie.Title}" style="height: 400px; object-fit: cover;">
                        <div class="card-body d-flex flex-column justify-content-end flex-grow-1">
                            <div class="mt-auto">
                                <h5 class="card-title fw-bold">${movie.Title}</h5>
                                <div class="mb-2">
                                    <span class="badge bg-danger">${movie.Year}</span>
                                    <span class="badge bg-secondary">${movie.Type}</span>
                                </div>
                                <div class="d-flex justify-content-end align-items-center">
                                    <button class="btn btn-sm btn-secondary">View Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                dataContainer.innerHTML += card;
            });
        })
        .catch(err => {
            console.error("Fetch error:", err);
            dataContainer.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again.</div>`;
        });
}

function searchMovie() {

    dataContainer.innerHTML = "";
    resultContainer.classList.remove("d-none");

    let search = document.getElementById("txtSearch").value.trim();

    if (search === "") {
        getAllResults("movie");
        return;
    }

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${search}`)
        .then(res => res.json())
        .then(result => {

            if (result.Response === "False") {
                resultContainer.classList.remove("d-none");
                resultContainer.innerHTML = `
                    <div class="alert alert-danger">No results found.</div>
                `;
                getSuggestResults('movie');
                return;
            }

            resultContainer.classList.remove("d-none");

            resultContainer.innerHTML = `
            <div class="card bg-dark text-white shadow-lg">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${result.Poster}"
                            class="img-fluid rounded-start w-100 h-100" style="object-fit: cover;">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h3 class="card-title mb-0 fw-bold">${result.Title}</h3>
                                <span class="badge bg-danger">${result.Rated}</span>
                            </div>
                            <p class="text-muted mb-3">
                                <span class="me-3 text-light">Release: <span class="fw-bold">${result.Year}</span></span>
                                <span class="me-3 text-light">Category: <span class="fw-bold">${result.Genre}</span></span>
                                <span class="badge bg-secondary">${result.Type}</span>
                            </p>
                            <p class="card-text">${result.Plot}</p>
                            <div class="mb-3">
                                <p class="mb-1"><strong>Starring:</strong> ${result.Actors}</p>
                                <p class="mb-1"><strong>Language:</strong> ${result.Language}</p>
                                <p class="mb-1"><strong>Country:</strong> ${result.Country}</p>
                                <p class="mb-0"><strong>Ratings:</strong> <i class="bi bi-star-fill text-warning"></i> ${result.imdbRating}/10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
            let genre = result.Genre.split(",");
            console.log(genre[0]);
            getSuggestResults(genre[0]);
        });
}


// function searchMovie() {

//     dataContainer.innerHTML = "";

//     if (search === "") {
//         getAllResults("movie");
//         return;
//     }

//     fetch(`https://www.omdbapi.com/?apikey=f60eb7d2&t=${search}`)
//         .then(res => res.json())
//         .then(result => {

//             // If movie not found
//             if (result.Response === "False") {
//                 resultContainer.classList.remove("d-none");
//                 resultContainer.innerHTML = `
//                     <div class="alert alert-danger">No results found.</div>
//                 `;
//                 return;
//             }

//             resultContainer.classList.remove("d-none");

//             resultContainer.innerHTML = `
//             <div class="card bg-dark text-white shadow-lg">
//                     <div class="row g-0">
//                         <div class="col-md-3">
//                             <img src="${result.Poster}"
//                                 class="img-fluid rounded-start w-100 h-100" style="object-fit: cover;"
//                                 alt="IT: Welcome to Derry">
//                         </div>
//                         <div class="col-md-9">
//                             <div class="card-body">
//                                 <div class="d-flex justify-content-between align-items-start mb-2">
//                                     <h3 class="card-title mb-0 fw-bold">IT: Welcome to Derry</h3>
//                                     <span class="badge bg-danger">TV-MA</span>
//                                 </div>
//                                 <p class="text-muted mb-3">
//                                     <span class="me-3 text-light">Release: <span class="fw-bold">2025-</span></span>
//                                     <span class="me-3 text-light">Category: <span class="fw-bold">Horror</span></span>
//                                     <span class="badge bg-secondary">TV Series</span>
//                                 </p>
//                                 <p class="card-text">It will follow the events in 1962, the time leading up to the
//                                     events of the first film based in 1989 of the Stephen King "It" series.</p>
//                                 <div class="mb-3">
//                                     <p class="mb-1"><strong>Starring:</strong> Bill Skarsgård, Taylour Paige, James
//                                         Remar</p>
//                                     <p class="mb-1"><strong>Language:</strong> English</p>
//                                     <p class="mb-1"><strong>Country:</strong> United States</p>
//                                     <p class="mb-1"><strong>Seasons:</strong> 1</p>
//                                     <p class="mb-0"><strong>Ratings:</strong> <i class="bi bi-star-fill text-warning"></i> 8.5/10</p>
//                                 </div>
//                                 <div class="d-flex gap-2">
//                                     <button class="btn btn-danger">Watch Trailer</button>
//                                     <button class="btn btn-light">More Info</button>
//                                     <button class="btn btn-light">Add to Watchlist</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//         `;

//         });

// }