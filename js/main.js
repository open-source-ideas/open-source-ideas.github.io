// This is where the magic happens
// Written by Fredrik August Madsen-Malmo (github@fredrikaugust)

// by default github paginates all responses with 30 items, we can change this by specifying the per-page property
// Also, we need to specify what page we need so we can paginate on the frontend as well.
var perPage = 20
var page = window.location.href.match(/page=(\d+)/) ? window.location.href.match(/page=(\d+)/)[1] : 1
var URL = "https://api.github.com/repos/open-source-ideas/open-source-ideas/issues?per_page="+perPage+"&page="+page;


function display_issues () {
  $.get({
    url: URL,
    success: function (data, status, xhr) {
      // the total number of pages we have in the pagination is gotten from the response header (Link)
      // However, to extract it, this is the simplest hack I could come up with.
      var str = xhr.getResponseHeader('Link')

      // if we can't find rel=last, then this is the last page
      pages = str.indexOf('rel="last"') > 0 ? parseInt(str[str.indexOf('rel="last"') - 4]) : page

      show_issues_in_dom(data, pages);
      $('.progress').slideUp();
    }
  });
}

function generate_label_html (labels) {
  var label_string = "";

  labels.forEach(function (label) {
    label_string += "<div class='chip'>" + label.name + "</div>";
  });

  return label_string;
}

function create_issue_url (issue) {
  var loc = window.location.href;
  // if the location ends with a slash
  if (loc.slice(-1) == '/') {
    return loc + 'issue.html?issue=' + issue;
  } else if (loc.indexOf('?') > 0){
    // if a url query has been applied, match the last / and replace everything onwards with the issue url
    return loc.replace(/(?:\/[^\/\r\n]*)$/, '/') + 'issue.html?issue=' + issue;
  }
  return loc.replace(/\w+\.[^\.]+$/, '') + 'issue.html?issue=' + issue;
}

function show_issues_in_dom (issues, pages) {
  issues.forEach(function (issue) {
    $('#cards .row').append(
      "<div class='col s12'>" +
      "<div class='card'>" +
      "<div class='card-content'>" +
      "<span class='card-title teal-text text-darken-4'>" +
      issue.title +
      "</span> " +
      generate_label_html(issue.labels) + "<p>" +
      marked(issue.body)
        .replace('<img', '<img class="responsive-img"')
        .replace(/h[1-6]/g, 'h5') +
      "</p>" + "</div><div class='card-action'>" +
      "<a href='" + create_issue_url(issue.number) +
      "'>Read more</a>" +
      "<a target='_blank' href='" + issue.html_url + "'>View on GitHub</a>" +
      "</div></div></div>"
    );

  });

  // let's add the pagination links
  for (var i = 1; i <= pages; i++) {
    var class_ = page == i ? "active" : "waves-effect"
    $('.pagination').append(
      "<li class='" + class_ + "'>" + 
        "<a href='" + window.location.href.replace(/(?:\/[^\/\r\n]*)$/, '') + "?page=" + i + "''>" + i +"</a>" + 
      "</li>"
    )
  }
}

$(document).ready(function () {
  display_issues();
});
