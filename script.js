/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// DO NOT TOUCH ///////////////////////////////////////
////////////////////////////////////////  HANDLEBARS  ///////////////////////////////////////

Handlebars.templates = Handlebars.templates || {};

var templates = document.querySelectorAll(
    'script[type="text/x-handlebars-template"]'
);

Array.prototype.slice.call(templates).forEach(function(script) {
    Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
});

/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// DO NOT TOUCH ///////////////////////////////////////
////////////////////////////////////////  HANDLEBARS  ///////////////////////////////////////

$("#go-button").on("click", function(e) {
	// prevend the normal behavior of the form: make request to server
    e.preventDefault(); 

    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();
    var userToSearch = $('input[name="user-to-search"]').val();

    // defines what website we're making the request to
    var baseUrl = "https://api.github.com";
    // endpoint means, what specific data do I want from GitHub
    var endpoint = "/users/" + userToSearch + "/repos";
    var fullUrl = baseUrl + endpoint;

    $.ajax({
        url: fullUrl,
        headers: {
            Authorization: "Basic " + btoa(username + ":" + password)
        },
        success: function(payload) {
        	// returns all repos of a user
            console.log("payload is ", payload); 

            // nrender the user's profile picture  + github username / repo on screen with handlebars
            $("#result").html(
                Handlebars.templates.repoAuthor({ repo: payload })
            );
        }
    });
});

$(document).on("click", ".repoName", function(e) {
    var repoContent = $(e.target).html(); // name of my repo
    var baseUrl = "https://api.github.com";
    var endpointCommit =
        "/repos/" + userToSearch + "/" + repoContent + "/commits";

    // limit for the amount of commits - 10
    var urlForCommit = baseUrl + endpointCommit;

    $.ajax({
        url: urlForCommit,
        headers: {
            Authorization: "Basic " + btoa(username + ":" + password)
        },
        success: function(commits) {
            var commits = commits.slice(0, 10); // list of 10 first commits
            console.log(commits);
            for (var i = 0; i < commits.length; i++) {
                $("#result").append(
                    Handlebars.templates.commitList({ commits: commits })
                );
            }
        }
    });
});
