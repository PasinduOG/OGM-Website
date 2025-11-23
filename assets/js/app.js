let dataContainer = document.getElementById("dataContainer");
let listHeader = document.getElementById("listHeader");
let search = document.getElementById("txtSearch").value;
let resultContainer = document.getElementById("resultContainer");

const defaultImage = 'assets/img/default.jpg';
const API_KEY = "f60eb7d2";

function getAllResults(type) {
    resultContainer.innerHTML = "";
    dataContainer.innerHTML = "";

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

function getSuggestResults(keyword, type) {
    dataContainer.innerHTML = "";

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&y=2025&s=${keyword}&type=${type}`)
        .then(res => res.json())
        .then(data => {

            if (!data.Search || data.Search.length === 0) {
                dataContainer.innerHTML = `<div class="alert alert-warning">No results found for "${keyword}"</div>`;
                return;
            }

            let suggestType;
            if (type == "movie") {
                suggestType = "Movies";
            } else {
                suggestType = "TV Series";
            }

            listHeader.innerText = `Suggested ${suggestType} from "${keyword}"`;

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
            <div class="card bg-dark text-white py-5 shadow-lg">
                    <div class="container py-4">
                        <div class="row align-items-center">
                            <div class="col-lg-3 col-md-4 mb-4 mb-md-0">
                                <img src="${result.Poster!= "N/A" ? result.Poster : defaultImage}"
                                    alt="Movie Poster" class="img-fluid rounded shadow-lg">
                            </div>
                            <div class="col-lg-9 col-md-8">
                                <div class="d-flex align-items-center mb-3 flex-wrap">
                                    <h2 class="h2 mb-0 me-3">${result.Title}</h2>
                                    <span class="badge bg-danger">${result.Rated}</span>
                                </div>
                                <p class="text-secondary mb-3">
                                    <span class="fw-bold text-white">Release:</span> ${result.Year} |
                                    <span class="fw-bold text-white">Category:</span> <span
                                        class="text-danger fw-semibold">${result.Genre}</span>
                                </p>
                                <p class="mb-4">${result.Plot}</p>
                                <button class="btn btn-danger px-4">View more</button>
                            </div>
                        </div>
                    </div>
                </div>
        `;
            let genre = result.Genre.split(",");
            console.log(genre[0]);
            getSuggestResults(genre[0], result.Type);
        });
}