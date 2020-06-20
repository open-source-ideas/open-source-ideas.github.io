var toTop = document.querySelector(".to-top");

window.onscroll = function() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    toTop.style.display = "block";
  } else {
    toTop.style.display = "none";
  }
};

var scrollToTop = () => {
  document.body.scrollTop = 0; // safari
  document.documentElement.scrollTop = 0; // literally everything else
}

var page = 1;
var label = null;
var list = document.querySelector(".articles");

const next = () => {
  page++;
  build();
}

const previous = () => {
  if (page == 1) {
    return
  }
  page--;
  build();
}

const labeled = (tag) => {
  page = 1;
  label = tag;
  build();
}

const build = () => {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(xhttp.responseText);
      list.innerHTML = "";
      if (data.length == null || data.length == 0) {
        list.innerHTML += "<div class='w3-margin'><div class='w3-container'><h3 style='text-align:center;'><b>No Ideas Found</b></h3></div><div class='w3-container'><p style='text-align:center;'>No ideas matching your search were found. Please try reloading the page.</p></div></div><hr>";
        return;
      }
      for (var i = 0; i < data.length; i++) {
        var idea = data[i];
        list.innerHTML += "<div class='w3-card-4 w3-margin w3-white'><div class='w3-container'><h3><b>"+idea.title+"</b></h3><h5><span class='w3-opacity'>Date of creation</span></h5></div><div class='w3-container'><p>"+marked(idea.body)+"</p><div class='w3-row'><div class='w3-col m8 s12'><p><a target='_blank' href='"+idea.html_url+"' class='w3-button w3-padding-large w3-white w3-border'><b>READ MORE &raquo;</b></a></p></div><div class='w3-col m4 w3-hide-small'><p><span class='w3-padding-large w3-right'><b>Comments &nbsp;</b> <span class='w3-tag'>"+idea.comments+"</span></span></p></div></div></div></div><hr>";
      }
      scrollToTop();
    }
  };
  if (label != null) {
    arg = "&labels="+label;
  } else {
    arg = "";
  }
  xhttp.open("GET", "https://api.github.com/repos/open-source-ideas/open-source-ideas/issues?state=open&page="+page+arg, true);
  xhttp.send();
}

build();

var labels = document.querySelector(".labels");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var data = JSON.parse(xhttp.responseText);
    labels.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
      var label = data[i];
      labels.innerHTML += "\n<span onclick='labeled("+'"'+label.name+'"'+")' class='w3-tag w3-light-grey w3-small w3-margin-bottom'>"+label.name+"</span>";
    }
  }
};
xhttp.open("GET", "https://api.github.com/repos/open-source-ideas/open-source-ideas/labels", true);
xhttp.send();
