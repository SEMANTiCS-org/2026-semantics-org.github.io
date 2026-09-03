function get_pc_csv(fcsv, page) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var html_superchairs = "";
      json_data.forEach(function (entry) {
        var fname = entry["first name"].trim();
        var lname = entry["last name"].trim();
        var role = entry["role"].trim().toLowerCase();
        var affiliation = entry["affiliation"].trim();
        var country = entry["country"].trim();
        var email = entry["email"].trim();
        var webpage = entry["Web page"].trim();
        var image = "../img/person/" + entry["image"].trim();

        //add email
        var str_email = "";
        if (email != "" && email.includes("@")) {
          str_email = "<a href='mailto:" + email + "'>[[VAR]]</i></a>";
        }

        //add country
        var str_country = "";
        if (country != "") {
          str_country = ", " + country;
        }

        if (page == "pc") {
          if (role == "pc member") {
            //var html_entry = "<li>"+fname+" "+lname+" ("+affiliation+str_country+") "+str_email.replace("[[VAR]]","<i class='bi bi-envelope-at'>")+"</li>";
            // with no Email
            var html_entry =
              "<li>" +
              fname +
              " " +
              lname +
              " (" +
              affiliation +
              str_country +
              ")</li>";
            $("#pc_members").append(html_entry);
          }
          if (role == "superchair") {
            var html_img =
              '<img typeof="foaf:Image" src="' +
              image +
              '" class="image-profile" alt="' +
              fname +
              " " +
              lname +
              '">';
            var str_html =
              '<div class="person col-sm-4">' +
              html_img +
              "<div>" +
              fname +
              " " +
              lname +
              "</div>" +
              "<div>" +
              affiliation +
              "</div>" +
              "<div class='person-role'>SUPERCHAIR</div>" +
              "</div>";
            //var str_html = '<div class="row psc-mem"><div class="col-lg-3 mx-auto image-profile"><img src="'+image+'" class=" image-profile"></div><div class="col-lg-9 mx-auto profile-details"><b>'+fname+' '+lname+'</b><br/>'+affiliation+str_country+'<br/></div></div>';
            html_superchairs += str_html;
          }
        }
      });
      $("#psc_members").append(
        "<div class='row section-content persons'>" +
          html_superchairs +
          "</div>",
      );
    },
  });
}

function get_oc_csv(fcsv, page, container) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var count = 0;
      var group_html = "";
      var group_num = 0;
      var group_class = "theme-row-alt";
      var current_role_group = "";
      json_data.forEach(function (entry) {
        //header: Conference Committee,Name,Email,Status,Contacted,Easychair,country,affiliation
        var conf_role = entry["Conference Committee"].trim();
        var conf_role_group = entry["Conference Committee Group"].trim();
        var name = entry["Name"].trim();
        var email = entry["Email"].trim();
        var affiliation = entry["affiliation"].trim();
        var country = entry["country"].trim();
        var image = "../img/person/" + entry["image"].trim();
        let img_size = "60";
        var html_img =
          '<img typeof="foaf:Image" src="' +
          image +
          '" class="image-profile" alt="' +
          name +
          '">';
        //add email
        var str_email = "";
        if (email != "" && email.includes("@")) {
          str_email = "<a href='mailto:" + email + "'>[[VAR]]</i></a>";
          str_email = str_email.replace("[[VAR]]", email);
          str_email = "";
        }

        // add role of each person if different from its group
        var add_person_role = false;
        if (conf_role_group.toLowerCase() != conf_role.toLowerCase()) {
          add_person_role = true;
        }

        // group background style
        if (group_num % 2 == 1) {
          group_class = "";
        } else {
          group_class = "";
        }

        if (current_role_group == "" || conf_role_group != current_role_group) {
          if (current_role_group.trim() != "") {
            $("#" + container).append(
              '<div class="row section-content persons ' +
                group_class +
                '">' +
                group_html +
                "</div>",
            );
            group_html = "";
            count = 0;
          }
          $("#" + container).append(
            '<div class="row"><div class="col-lg-12 group-title"><h2>' +
              conf_role_group +
              "</h2></div></div>",
          );
          current_role_group = conf_role_group;
          group_num += 1;
        }

        if (count == 3) {
          $("#" + container).append(
            '<div class="row section-content persons ' +
              group_class +
              '">' +
              group_html +
              "</div>",
          );
          group_html = "";
          count = 0;
        }
        //var str_html = '<div class="row profile"><div class="col-lg-12 mx-auto"><div class="row"><div class="col-lg-3 mx-auto role-profile"><h4>'+conf_role+'</h4></div><div class="col-lg-9 mx-auto"><div class="row"><div class="col-lg-3 mx-auto image-profile"><img src="'+image+'" class=" image-profile"></div><div class="col-lg-9 mx-auto profile-details"><b>'+name+'</b><br/>'+affiliation+'<br/>'+country+'<br />'+str_email+'</div></div></div></div></div></div>';
        var html_body =
          html_img +
          '<div class="person-name">' +
          name +
          "</div>" +
          '<div class="person-info">' +
          affiliation +
          "</div>";
        if (country != "") {
          html_body += '<div class="person-info">' + country + "</div>";
        }
        if (add_person_role) {
          html_body =
            html_body +
            '<div class="person-role">' +
            conf_role.toUpperCase() +
            "</div>";
        }
        var str_html = '<div class="person col-sm-4">' + html_body + "</div>";
        group_html = group_html + str_html;
        count = count + 1;
      });
      if (group_html != "") {
        $("#" + container).append(
          '<div class="row section-content persons d-flex justify-content-center">' +
            group_html +
            "</div>",
        );
      } else {
        document.getElementById(container).lastChild.innerHTML = document
          .getElementById(container)
          .lastChild.innerHTML.replace(
            "row section-content persons",
            "row section-content persons d-flex justify-content-center",
          );
      }
    },
  });
}

function populate_logo_list(fcsv, page, container) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);

      var count = 0;
      var group_html = "";
      json_data.forEach(function (entry) {
        //header: Conference Committee,Name,Email,Status,Contacted,Easychair,country,affiliation
        // <div class="org col-sm-3"><a href="http://www.semantic-web.at/" target="_blank"><img typeof="foaf:Image" src="https://2022-eu.semantics.cc/sites/2022-eu.semantics.cc/files/styles/logo/public/Sponsors/swc-logo-web.png?itok=dFh75utd" width="150" height="37" alt=""></a></div>

        var name = entry["name"].trim();
        var img_ratio = entry["img_ratio"].trim().split("/");
        var img = "img/partners_orgs/" + entry["img"].trim();

        let img_size = 3;
        var img_width = parseInt(img_ratio[0]) * img_size;
        var img_height = parseInt(img_ratio[1]) * img_size;
        var html_img =
          '<img typeof="foaf:Image" src="' +
          img +
          '" width="' +
          img_width.toString() +
          '" height="' +
          img_height.toString() +
          '" alt="' +
          name +
          ' logo">';

        var url = entry["url"].trim();
        var html_url =
          "<a href='" + url + "' target='_blank'>" + html_img + "</a>";

        var str_html = '<div class="org col-sm-3">' + html_url + "</div>";
        count = count + 1;
        group_html = group_html + str_html;

        if (count == 4) {
          $("#" + container).append(
            '<div class="row section-content orgs">' + group_html + "</div>",
          );
          group_html = "";
          count = 0;
        }
      });
      if (group_html != "") {
        $("#" + container).append(
          '<div class="row section-content orgs d-flex justify-content-center">' +
            group_html +
            "</div>",
        );
      } else {
        document.getElementById(container).lastChild.innerHTML = document
          .getElementById("org_list")
          .lastChild.innerHTML.replace(
            "row section-content orgs",
            "row section-content orgs d-flex justify-content-center",
          );
      }
    },
  });
}

function populate_sponsors_list(fcsv, page, container) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var MAX_ELEMS = 2;
      var col_size = 12 / MAX_ELEMS;

      var sponsor_type_list = [
        "gold",
        "silver",
        "bronze",
        "startup",
        "bluesky",
        "orkg",
        "student",
      ];
      for (var i = 0; i < sponsor_type_list.length; i++) {
        var count = 0;
        var count_by_type = 0;
        var group_html = "";
        sponsor_type = sponsor_type_list[i];

        // get all entries for this type
        var entries_by_type = json_data.filter(function (entry) {
          return entry["type"].trim() == sponsor_type;
        });

        var count_total = entries_by_type.length;

        // build title
        var title = "";
        if (sponsor_type == "bluesky") {
          title = "BLUE SKY PAPERS AWARDS";
        } else if (sponsor_type == "orkg") {
          title = "ORKG CONTENT AWARDS";
        } else if (sponsor_type == "student") {
          title = "STUDENT SUPPORT";
        } else {
          var base = sponsor_type.toUpperCase();
          title = count_total === 1 ? base + " SPONSOR" : base + " SPONSORS";
        }

        //add sponsor header
        $("#" + container + " #s_" + sponsor_type).append(
          '<div class="row section-content justify-content-center"><h4 class="title-section text-center" style="width: 100%">' +
            title +
            "</h4></div>",
        );

        entries_by_type.forEach(function (entry) {
          if (entry["type"].trim() == sponsor_type) {
            var name = entry["name"].trim();
            var img_ratio = entry["img_ratio"].trim().split("/");
            var img = "img/sponsors/" + entry["img"].trim();

            let img_size = 3;
            var img_width = parseInt(img_ratio[0]) * img_size;
            var img_height = parseInt(img_ratio[1]) * img_size;
            // for propotions use:
            var html_img =
              '<img class="sponsor-img" width="' +
              img_width.toString() +
              '" height="' +
              img_height.toString() +
              '" typeof="foaf:Image" src="' +
              img +
              '" alt="' +
              name +
              ' logo">';
            //var html_img = '<img class="sponsor-img" typeof="foaf:Image" src="'+img+'" alt="">'

            var url = entry["url"].trim();
            var html_url =
              "<a href='" + url + "' target='_blank'>" + html_img + "</a>";

            var str_html =
              '<div class="sponsor d-flex align-items-center justify-content-center col-' +
              col_size.toString() +
              '">' +
              html_url +
              "</div>";
            count = count + 1;
            count_by_type = count_by_type + 1;
            group_html = group_html + str_html;

            if (count == MAX_ELEMS) {
              $("#" + container + " #s_" + sponsor_type).append(
                '<div class="row section-content sponsors justify-content-center">' +
                  group_html +
                  "</div>",
              );
              group_html = "";
              count = 0;
            }
          }
        });
        if (group_html != "") {
          while (MAX_ELEMS - count > 0) {
            //group_html += '<div class="sponsor col-'+col_size.toString()+'"></div>';
            count += 1;
          }
          $("#" + container + " #s_" + sponsor_type).append(
            '<div class="row section-content sponsors justify-content-center">' +
              group_html +
              "</div>",
          );
        }
        if (count_by_type == 0) {
          $("#" + container + " #s_" + sponsor_type).remove();
        }
      }
    },
  });
}

function populate_keyspeakers(fcsv, page, container, baseurl) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var all_speakers_html = [];

      json_data.forEach(function (entry) {
        var e_type = entry["type"]
          .trim()
          .split("-")
          .map((item) => "s-" + item)
          .join(" ");
        var name = entry["name"].trim();
        var affiliation = entry["affiliation"].trim();
        var presentation = entry["presentation"].trim();
        var page_name = entry["page_name"].trim();
        var img = entry["image"].trim();
        var googleScholar = entry["googleScholar"].trim();
        var LinkedIn = entry["LinkedIn"].trim();
        var website = entry["website"].trim();
        let img_size = "60";

        var html_img =
          '<img src="img/LTILogoByLine.png" class="image-profile-type" alt=""><img typeof="foaf:Image" src="img/person/' +
          img +
          '" class="image-profile" alt="' +
          name +
          '">';
        var html_presentation =
          "<a href='" +
          baseurl +
          "page/" +
          page_name +
          "' class='person-talk'>" +
          presentation +
          "</a>";
        var html_google =
          "<a href='" +
          googleScholar +
          "' target='_blank' class='social'><img src='img/icons/googleScholar.svg' class='social' alt='Google Scholar profile of " +
          name +
          "'/></a>";
        var html_web =
          "<a href='" +
          website +
          "' target='_blank' class='social'><img src='img/icons/website.svg' class='social' alt='Website of " +
          name +
          "'/></a>";
        var html_body =
          html_img +
          '<div class="person-name">' +
          name +
          "</div>" +
          '<div class="person-info">' +
          affiliation +
          "</div>" +
          html_presentation;
        var str_html =
          '<div class="ks col-sm-4 ' + e_type + '">' + html_body + "</div>";
        all_speakers_html.push(str_html);
      });

      var total_speakers = all_speakers_html.length;
      var speaker_idx = 0;

      // Special case: if total is 4, 7, 10, ... (3k+1) and not 1, we want to end with 2+2
      if (total_speakers > 1 && total_speakers % 3 === 1) {
        // Process in groups of 3 until the last 4
        while (speaker_idx < total_speakers - 4) {
          let group_html = all_speakers_html
            .slice(speaker_idx, speaker_idx + 3)
            .join("");
          $("#" + container).append(
            '<div class="row section-content kss">' + group_html + "</div>",
          );
          speaker_idx += 3;
        }
        // Process the last 4 as two groups of 2
        let group1 = all_speakers_html
          .slice(speaker_idx, speaker_idx + 2)
          .join("");
        $("#" + container).append(
          '<div class="row section-content kss d-flex justify-content-center">' +
            group1 +
            "</div>",
        );
        speaker_idx += 2;
        let group2 = all_speakers_html
          .slice(speaker_idx, speaker_idx + 2)
          .join("");
        $("#" + container).append(
          '<div class="row section-content kss d-flex justify-content-center">' +
            group2 +
            "</div>",
        );
      } else {
        // Original logic for all other cases (1, 2, 3, 5, 6, ...)
        while (speaker_idx < total_speakers) {
          let slice_end = speaker_idx + 3;
          let group_html = all_speakers_html
            .slice(speaker_idx, slice_end)
            .join("");
          $("#" + container).append(
            '<div class="row section-content kss d-flex justify-content-center">' +
              group_html +
              "</div>",
          );
          speaker_idx += 3;
        }
      }
    },
  });
}

function populate_quotes_container(fcsv, page, container, baseurl) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var body_html = `
              <div id="carousel_container" class="carousel slide" data-ride="carousel">
                  <ol class="carousel-indicators">
                    __INDICATORS__
                  </ol>
                  <div class="carousel-inner">
                      __SLIDES__
                  </div>
              </div>
        `;

      all_html_elems = "";
      all_html_ol = "";
      count_slide = 0;
      is_active = "active";
      json_data.forEach(function (entry) {
        var name = entry["person"].trim();
        var affiliation = entry["affiliation"];
        var quote = entry["quote"];

        var image = "../img/person/quotes/" + entry["img"].trim();
        if (page == "index") {
          image = baseurl + "img/person/quotes/" + entry["img"].trim();
        }

        var html_img =
          '<img typeof="foaf:Image" src="' +
          image +
          '" class="image-profile" alt="' +
          name +
          '">';
        var person_body =
          html_img +
          '<div class="person-name">' +
          name +
          "</div>" +
          '<div class="person-info-alt">' +
          affiliation +
          "</div>";

        all_html_elems +=
          `
              <div class="carousel-item ` +
          is_active +
          `">
                <div class="row">
                  <div class="col-lg-5 mx-auto text-center align-self-center">` +
          person_body +
          `</div>
                  <div class="col-lg-7 mx-auto align-self-center person-quote"><i>"` +
          quote +
          `"</i></div>
                </div>
          </div>`;
        all_html_ol +=
          `<li data-target="#carousel_container" data-slide-to="` +
          count_slide.toString() +
          `" class="` +
          is_active +
          `"></li>`;
        count_slide += 1;
        is_active = "";
      });

      body_html = body_html.replace("__INDICATORS__", all_html_ol);
      body_html = body_html.replace("__SLIDES__", all_html_elems);
      $("#" + container).append(body_html);
    },
  });
}
function populate_news_container(fcsv, page, container, baseurl) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var body_html = `<div class="row section-content"> __NEWS__ </div>`;
      var all_html_elems = "";
      var count_news = 1;
      const MAX_NEWS = 4;
      json_data.forEach(function (entry) {
        if (count_news <= MAX_NEWS) {
          var title = entry["title"].trim();
          var text = entry["text"];
          var page_name = entry["page_name"];
          var image = "../img/news/thumbs/" + entry["img"].trim();
          if (page == "index") {
            image = baseurl + "img/news/thumbs/" + entry["img"].trim();
          }

          var html_img =
            '<div class="container-img-news"><img typeof="foaf:Image" src="' +
            image +
            '" class="news-img" alt="' +
            title +
            '"></div>';
          all_html_elems +=
            `<div class="col-lg-3 mx-auto news-box"> <a href="` +
            baseurl +
            "page/news?page=" +
            page_name +
            `" class="news-link">` +
            html_img +
            `<h5 class='news-title'>` +
            title +
            `</h5>` +
            `<hr/>` +
            `<div class="news-abs">` +
            text +
            `</div>` +
            // + `<div class="news-link"><a href="`+baseurl+"page/news?page="+page_name+`">Read More</a></div>`
            `</a></div>`;
        }
        count_news += 1;
      });

      body_html = body_html.replace("__NEWS__", all_html_elems);
      $("#" + container).append(body_html);
    },
  });
}

function populate_news_blog_container(fcsv, page, container, baseurl) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var body_html = `<div class="row section-content"> __NEWS__ </div>`;
      var all_html_elems = "";
      var count_news = 1;
      const MAX_NEWS = 12;
      json_data.forEach(function (entry) {
        if (count_news <= MAX_NEWS) {
          var title = entry["title"].trim();
          var text = entry["text"];
          var page_name = entry["page_name"];
          var image = "../img/news/thumbs/" + entry["img"].trim();
          if (page == "index") {
            image = baseurl + "img/news/thumbs/" + entry["img"].trim();
          }

          var html_img =
            '<div class="container-img-news"><img typeof="foaf:Image" src="' +
            image +
            '" class="news-img" alt="' +
            title +
            '"></div>';
          all_html_elems +=
            `<div class="col-lg-3 mx-auto news-box"> <a href="` +
            baseurl +
            "page/news?page=" +
            page_name +
            `" class="news-link">` +
            html_img +
            `<h5 class='news-title'>` +
            title +
            `</h5>` +
            `<hr/>` +
            `<div class="news-abs">` +
            text +
            `</div>` +
            // + `<div class="news-link"><a href="`+baseurl+"page/news?page="+page_name+`">Read More</a></div>`
            `</a></div>`;
        }
        count_news += 1;
      });

      body_html = body_html.replace("__NEWS__", all_html_elems);
      $("#" + container).append(body_html);
    },
  });
}

function populate_news_list_container(fcsv, page, container, baseurl) {
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var body_html = ``;
      var all_html_elems = `<div class='row-1'><div style="padding:0px;" class="col-lg-12 mx-auto text-center"><div class="card-header-1"><h2>ALL NEWS</h2></div>`;
      var prev_date_group = "";
      json_data.forEach(function (entry) {
        var title = entry["title"].trim();
        var page_name = entry["page_name"];
        //get date
        const index_months = {
          "01": "January",
          "02": "February",
          "03": "March",
          "04": "April",
          "05": "May",
          "06": "June",
          "07": "July",
          "08": "August",
          "09": "September",
          10: "October",
          11: "November",
          12: "December",
        };
        var parts_date = page_name.split("-");
        const year = parts_date[0];
        const month = parts_date[1];
        const day = parts_date[2];
        const g_date_id = month + "_" + year;
        const g_date = index_months[month] + ", " + year;
        if (g_date != prev_date_group) {
          all_html_elems +=
            `</div></div>` +
            `<div class="card-header" id="heading_` +
            g_date_id +
            `"><button class="btn" data-toggle="collapse" data-target="#collapse_` +
            g_date_id +
            `" aria-expanded="true" aria-controls="collapse_` +
            g_date_id +
            `">` +
            g_date +
            `</button></div>` +
            `<div id="collapse_` +
            g_date_id +
            `" class="collapse show" aria-labelledby="heading_` +
            g_date_id +
            `" data-parent="#allnews">` +
            `<div class="card-body">`;
          prev_date_group = g_date;
        }

        all_html_elems +=
          `<div class="row">
                              <a class="custom-link" href="` +
          baseurl +
          "page/news?page=" +
          page_name +
          `"> ➤ ` +
          title +
          `</a>
                            </div>`;
      });

      all_html_elems +=
        `</div></div>` +
        `<div class="card-header" id="heading_news_2025"><a class="custom-link" href="https://2025-eu.semantics.cc/page/blog_news">Check past news (from SEMANTiCS 2025)</a></div>`;

      body_html = all_html_elems + `</div></div>`;
      body_html =
        `<div id="allnews"><div class="card">` + body_html + `</div></div>`;
      $("#" + container).append(body_html);
    },
  });
}

function populate_ks_att(fcsv, page, container, baseurl) {
  const current_page = urlParams.get("page");
  $.ajax({
    url: fcsv,
    dataType: "text",
    success: function (fdata) {
      var json_data = $.csv.toObjects(fdata);
      var body_html = ``;
      var all_html_elems = `<div class='row'><div style="padding:5px;" class="col-lg-12 mx-auto text-center"><h2>ALL Available material for this talk</h2></div></div><div><div>`;
      var prev_date_group = "";
      json_data.forEach(function (entry) {
        var page_name = entry["page_name"];
        if (current_page == page_name) {
          console.log(entry);
        }

        all_html_elems +=
          `<div class="row"><a href="` +
          baseurl +
          "page/kp?page=" +
          page_name +
          `"> ` +
          title +
          `</a></div>`;
      });

      all_html_elems += `</div></div>`;

      body_html = all_html_elems + `</div></div>`;
      body_html =
        `<div id="allnews"><div class="card">` + body_html + `</div></div>`;
      $("#" + container).append(body_html);
    },
  });
}

function build_pc(conf) {
  get_pc_csv(conf["baseurl"] + "content/pc.csv", "pc");
}

function build_oc(conf) {
  get_oc_csv(conf["baseurl"] + "content/oc.csv", "oc", "oc_members");
}

function build_organizers_list(conf) {
  populate_logo_list(
    conf["baseurl"] + "content/organizers.csv",
    "index",
    "org_list",
  );
}

function build_partners_list(conf) {
  populate_logo_list(
    conf["baseurl"] + "content/partners.csv",
    "index",
    "partners_list",
  );
}

function build_sponsors_list(conf) {
  populate_sponsors_list(
    conf["baseurl"] + "content/sponsors.csv",
    "index",
    "sponsors_list",
  );
}

function build_ks(conf) {
  populate_keyspeakers(
    conf["baseurl"] + "content/keyspeakers.csv",
    "index",
    "keynote_list",
    conf["baseurl"],
  );
}
function build_ks_att(conf) {
  populate_ks_att(
    conf["baseurl"] + "content/keyspeakers.csv",
    "keyspeakers",
    "ks_att",
    conf["baseurl"],
  );
}

function build_quotes(conf) {
  populate_quotes_container(
    conf["baseurl"] + "content/quotes.csv",
    "index",
    "quotes",
    conf["baseurl"],
  );
}

function build_news(conf) {
  populate_news_container(
    conf["baseurl"] + "content/news.csv",
    "index",
    "news",
    conf["baseurl"],
  );
}

function build_news_list(conf) {
  populate_news_list_container(
    conf["baseurl"] + "content/news.csv",
    "news",
    "news_list",
    conf["baseurl"],
  );
}
function build_news_blog(conf) {
  populate_news_blog_container(
    conf["baseurl"] + "content/news.csv",
    "blog_news",
    "blog_news",
    conf["baseurl"],
  );
}
/* =========================================================
   P&D LIST
========================================================= */

function populate_pd(fcsv, page, container, baseurl) {

    $.ajax({
        url: fcsv,
        dataType: "text",

        success: function (data) {

            const entries = $.csv.toObjects(data);

            const groups = [
                {
                    key: "ri",
                    title: "R&I Fast-tracked Posters"
                },
                {
                    key: "demos",
                    title: "Demos"
                },
                {
                    key: "pd",
                    title: "Posters & Demos"
                }
            ];

            let html = "";

            groups.forEach(function (group) {

                const group_entries = entries.filter(function (entry) {

                    return (entry.group || "")
                        .trim()
                        .toLowerCase() === group.key;

                });

                if (group_entries.length === 0) {
                    return;
                }

                html += `
                    <section class="pd-group">

                        <h2 class="pd-group-title">
                            ${group.title}
                        </h2>

                        <div class="pd-table">

                            <div class="pd-table-header">
                                <div class="pd-col-id">ID</div>
                                <div class="pd-col-title">Title</div>
                                <div class="pd-col-authors">Authors</div>
                                <div class="pd-col-media">Multimedia</div>
                            </div>
                `;

                group_entries.forEach(function (entry) {

                    const id = (entry.id || "").trim();
                    const title = (entry.title || "").trim();
                    const authors = (entry.authors || "").trim();

                    html += `
                        <a
                            class="pd-table-row"
                            href="${baseurl}page/p&d-detail?page=${encodeURIComponent(id)}"
                            aria-label="Open ${title}"
                        >

                            <div class="pd-col-id">
                                ${id}
                            </div>

                            <div class="pd-col-title">
                                ${title}
                            </div>

                            <div class="pd-col-authors">
                                ${authors}
                            </div>

                            <div class="pd-col-media">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                </svg>

                            </div>

                        </a>
                    `;
                });

                html += `
                        </div>
                    </section>
                `;
            });

            $("#" + container).html(html);
        },

        error: function () {

            $("#" + container).html(
                "<p>Unable to load P&D data.</p>"
            );
        }
    });
}


/* =========================================================
   P&D LIST BUILD
========================================================= */

function build_pd(conf) {

    populate_pd(
        conf["baseurl"] + "content/p&d.csv",
        "p&d-detail",
        "pd_list",
        conf["baseurl"]
    );
}


/* =========================================================
   YOUTUBE ID
========================================================= */

function get_youtube_id(url) {

    if (!url) {
        return "";
    }

    url = url.trim();

    let match;

    /* youtube.com/watch?v= */
    match = url.match(/[?&]v=([^&]+)/);

    if (match) {
        return match[1];
    }

    /* youtu.be/ */
    match = url.match(/youtu\.be\/([^?&]+)/);

    if (match) {
        return match[1];
    }

    /* youtube.com/embed/ */
    match = url.match(/youtube\.com\/embed\/([^?&]+)/);

    if (match) {
        return match[1];
    }

    return "";
}


/* =========================================================
   P&D DETAIL
========================================================= */

function populate_pd_detail(fcsv, container, baseurl) {

    const params = new URLSearchParams(window.location.search);
    const requested_id = params.get("page");

    if (!requested_id) {

        $("#" + container).html(
            "<p>Paper not found.</p>"
        );

        return;
    }

    $.ajax({
        url: fcsv,
        dataType: "text",

        success: function (data) {

            const entries = $.csv.toObjects(data);

            const entry = entries.find(function (item) {

                return String(item.id).trim() ===
                       String(requested_id).trim();

            });

            if (!entry) {

                $("#" + container).html(
                    "<p>Paper not found.</p>"
                );

                return;
            }


            /* =================================================
               BASIC DATA
            ================================================= */

            const id = (entry.id || "").trim();
            const title = (entry.title || "").trim();
            const authors = (entry.authors || "").trim();
            const abstracts = (entry.abstracts || "").trim();

            const image = (entry.img || "").trim();

            /* ACCESSIBILITY DATA */
            const alt_text = (entry.alt_text || "").trim();
            const captions = (entry.captions || "").trim();
            const transcript = (entry.transcript || "").trim();

            const video_link = (entry.video_link || "").trim();
            const doc_link = (entry.doc_link || "").trim();

            const keywords = (entry.Keywords || "").trim();


            /* =================================================
               POSTER / PDF / IMAGE
            ================================================= */

            let poster_html = "";

            if (image) {

                const google_match = image.match(
                    /drive\.google\.com\/file\/d\/([^/]+)/
                );


                /* ---------------------------------------------
                   GOOGLE DRIVE PDF
                --------------------------------------------- */

                if (google_match) {

                    const file_id = google_match[1];

                    const google_preview_url =
                        `https://drive.google.com/file/d/${file_id}/preview`;

                    poster_html = `

                        <div class="pd-detail-pdf">

                            <div class="pd-media-loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <iframe
                                src="${google_preview_url}"
                                title="${alt_text || title}"
                                allow="autoplay"
                                onload="this.parentElement.classList.add('pd-media-loaded')"
                            ></iframe>

                        </div>

                    `;
                }


                /* ---------------------------------------------
                   LOCAL IMAGE
                --------------------------------------------- */

                else {

                    const local_image =
                        `${baseurl}img/pd/${image}`;

                    poster_html = `

                        <div class="pd-detail-image">

                            <div class="pd-media-loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <img
                                src="${local_image}"
                                alt="${alt_text || title}"
                                onload="this.parentElement.classList.add('pd-media-loaded')"
                            >

                        </div>

                    `;
                }
            }


            /* =================================================
               YOUTUBE VIDEO
            ================================================= */

            let video_html = "";

            const youtube_id =
                get_youtube_id(video_link);

            if (youtube_id) {

                video_html = `

                    <div class="pd-detail-video">

                        <iframe
                            src="https://www.youtube.com/embed/${youtube_id}"
                            title="${alt_text || title}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen>
                        </iframe>

                    </div>

                `;
            }


            /* =================================================
               MEDIA TABS
            ================================================= */

            let media_html = "";

            const has_poster = !!image;
            const has_video = !!youtube_id;


            if (has_poster || has_video) {

                let tabs_html = "";
                let content_html = "";


                /* ---------------------------------------------
                   POSTER + VIDEO
                --------------------------------------------- */

                if (has_poster && has_video) {

                    tabs_html = `

                        <div class="pd-media-tabs">

                            <button
                                type="button"
                                class="pd-media-tab active"
                                data-media="poster">
                                Poster
                            </button>

                            <button
                                type="button"
                                class="pd-media-tab"
                                data-media="video">
                                Video
                            </button>

                        </div>

                    `;

                    content_html = `

                        <div class="pd-media-content">

                            <div
                                class="pd-media-panel active"
                                data-panel="poster">

                                ${poster_html}

                            </div>

                            <div
                                class="pd-media-panel"
                                data-panel="video">

                                ${video_html}

                            </div>

                        </div>

                    `;
                }


                /* ---------------------------------------------
                   POSTER ONLY
                --------------------------------------------- */

                else if (has_poster) {

                    content_html = `

                        <div class="pd-media-content">

                            <div class="pd-media-panel active">

                                ${poster_html}

                            </div>

                        </div>

                    `;
                }


                /* ---------------------------------------------
                   VIDEO ONLY
                --------------------------------------------- */

                else if (has_video) {

                    content_html = `

                        <div class="pd-media-content">

                            <div class="pd-media-panel active">

                                ${video_html}

                            </div>

                        </div>

                    `;
                }


                media_html = `

                    <div class="pd-detail-media">

                        ${tabs_html}

                        ${content_html}

                    </div>

                `;
            }


            /* =================================================
               ABSTRACT
            ================================================= */

            let abstract_html = "";

            if (abstracts) {

                abstract_html = `

                    <div class="pd-detail-section">

                        <h3>Abstract</h3>

                        <div class="pd-detail-abstract">
                            ${abstracts}
                        </div>

                    </div>

                `;
            }


            /* =================================================
               KEYWORDS
            ================================================= */

            let keywords_html = "";

            if (keywords) {

                keywords_html = `

                    <div class="pd-detail-section">

                        <h3>Keywords</h3>

                        <div class="pd-detail-keywords">
                            ${keywords}
                        </div>

                    </div>

                `;
            }


            /* =================================================
               ACCESSIBILITY - CAPTIONS
               Visible to screen readers, hidden visually
            ================================================= */

            let captions_html = "";

            if (captions) {

                captions_html = `

                    <div class="sr-only">

                        <h2>Captions</h2>

                        <p>
                            ${captions}
                        </p>

                    </div>

                `;
            }


            /* =================================================
               ACCESSIBILITY - TRANSCRIPT
               Visible to screen readers, hidden visually
            ================================================= */

            let transcript_html = "";

            if (transcript) {

                transcript_html = `

                    <div class="sr-only">

                        <h2>Transcript</h2>

                        <p>
                            ${transcript}
                        </p>

                    </div>

                `;
            }


            /* =================================================
               DOCUMENT
            ================================================= */

            let document_html = "";

            if (doc_link) {

                document_html = `

                    <div class="pd-detail-buttons">

                        <a
                            class="pd-detail-button"
                            href="${doc_link}"
                            target="_blank"
                            rel="noopener noreferrer">

                            View Paper

                        </a>

                    </div>

                `;
            }


            /* =================================================
               FINAL HTML
            ================================================= */

            $("#" + container).html(`

                <div class="pd-detail-card">

                    <div class="pd-detail-id">
                        <span>#</span> ${id}
                    </div>

                    <h1 class="pd-detail-title">
                        ${title}
                    </h1>

                    <div class="pd-detail-authors">
                        <span>Authors: </span>
                        ${authors}
                    </div>

                    ${media_html}

                    ${abstract_html}

                    ${keywords_html}

                    ${captions_html}

                    ${transcript_html}

                    ${document_html}

                </div>

            `);


            /* =================================================
               MEDIA TAB CLICK
            ================================================= */

            $("#" + container).on(
                "click",
                ".pd-media-tab",
                function () {

                    const selected =
                        $(this).data("media");

                    $("#" + container)
                        .find(".pd-media-tab")
                        .removeClass("active");

                    $(this).addClass("active");

                    $("#" + container)
                        .find(".pd-media-panel")
                        .removeClass("active");

                    $("#" + container)
                        .find(
                            `.pd-media-panel[data-panel="${selected}"]`
                        )
                        .addClass("active");
                }
            );

        },

        error: function () {

            $("#" + container).html(
                "<p>Unable to load P&D data.</p>"
            );
        }
    });
}


/* =========================================================
   P&D DETAIL BUILD
========================================================= */

function build_pd_detail(conf) {

    populate_pd_detail(
        conf["baseurl"] + "content/p&d.csv",
        "pd_detail",
        conf["baseurl"]
    );
}