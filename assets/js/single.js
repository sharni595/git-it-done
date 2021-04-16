var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function(){
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    console.log(repoName);
    if (repoName){
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else{
        document.location.replace("./index.html");
    }
}

var getRepoIssues = function(repo){
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiUrl)
        .then(function(response){
            if (response.ok){
                response.json().then(function(data){
                    displayIssues(data);
                    //check if api has paginated issues
                    if(response.headers.get("Link")){
                        displayWarning(repo);
                    }

                })
            }else{
                document.location.replace("./index.html");
            }
        });
};

var displayIssues = function(issues){

    if (issues.length === 0){
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++){
       var issueEl = document.createElement("a");
       issueEl.classList = "list-item flex-row justify-space-between align-center";
       issueEl.setAttribute("href", issues[i].html_url);
       issueEl.setAttribute("target", "_blank"); 

       //create spaan to hold issue title
       var titleEl = document.createElement("span");
       titleEl.textContent = issues[i].title;

       //append to container
       issueEl.appendChild(titleEl);

       //create type element
       var typeEl = document.createElement("span");
       //check if issue is actual issue or pull request
       if (issues[i].pull_request){
           typeEl.textContent = "(Pull Request)";
       }else{
           typeEl.textContent = "(Issue)";
       }

       //append to container
       issueEl.appendChild(typeEl);

       issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo){
    limitWarningEl.textContent = "to see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    limitWarningEl.appendChild(linkEl);
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
    fetch(apiUrl);
  };


getRepoName();