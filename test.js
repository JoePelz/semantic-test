var canvas;
var ctx;

function init() {
  "use strict";
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  init_canvas(canvas, ctx);

  $(document.getElementById("selectionInfo")).accordion();
  $("#settings_menu").dropdown({
      action: function (happening) { console.log("Settings action:", happening); }
  });
  $(".input.icon").popup();


  // for "demo data" message box
  let msgbox = document.getElementById("demo_msg");
  $(msgbox).transition("fade");
  $('.message .close')
    .on('click', function() {
      $(this)
        .closest('.message')
        .transition('fade');
  });

  //retrieve config settings
  init_configbuttons();

  //sidebar init
  $('.ui.sidebartest .ui.sidebar')
    .sidebar({
      context: $('.ui.sidebartest'),
      dimPage: false,
      closable: false,
      transition: 'push'
    })
    .sidebar('attach events', '.drawer-toggle')
  ;
}




(function () {
  "use strict";
  let map_config = {};
  map_config.structure = {};

  map_config.reset = function () {
    map_config.structure = {};
  }

  map_config.clear_html = function (accordion) {
    accordion.innerHTML = "";
  };

  map_config.make_html = function (parent, structure) {
    Object.keys(structure).forEach(function (key) {
      let titleDiv = document.createElement("DIV");
      titleDiv.className = "title"
      let ddi = document.createElement("I");
      ddi.className = "dropdown icon";
      titleDiv.appendChild(ddi);
      titleDiv.appendChild(document.createTextNode(key));
      let contentDiv = document.createElement("DIV");
      contentDiv.className = "content";

      //objects attached?
      let cat = structure[key];
      if (cat.hasOwnProperty("objects")) {
        cat.objects.forEach( function (item) {
          contentDiv.appendChild(item);
        });
      }

      if (cat.hasOwnProperty("children") && Object.keys(cat.children).length > 0) {
        map_config.make_html(contentDiv, cat.children);
      }

      parent.appendChild(titleDiv);
      parent.appendChild(contentDiv);
    });
  };

  map_config.init = function (accordion) {
    $(accordion).accordion({
      exclusive: false,
      animateChildren: false
    });
  };

  map_config.rebuild = function () {
    let accordion = document.getElementById("mapconfig");
    map_config.clear_html(accordion);
    map_config.make_html(accordion, map_config.structure);
    map_config.init(accordion);
  };

  map_config.add_category = function (cat) {
    if (map_config.structure.hasOwnProperty(cat)) {
      return;
    }
    map_config.structure[cat] = {objects: [], children: {}};
  };

  map_config.add_subcategory = function (cat, subcat) {
    if (!map_config.structure.hasOwnProperty(cat)) {
      map_config.add_category(cat);
    }
    if (map_config.structure[cat].children.hasOwnProperty(subcat)) {
      return;
    }
    map_config.structure[cat].children[subcat] = {objects: [], children: {}};
  };

  map_config.add_object = function (cat, subcat, obj) {
    if (!map_config.structure.hasOwnProperty(cat)) {
      map_config.add_category(cat);
    }
    if (subcat) {
      if (!map_config.structure[cat].children.hasOwnProperty(subcat)) {
        map_config.add_subcategory(cat, subcat);
      }
      map_config.structure[cat].children[subcat].objects.push(obj);
    } else {
      map_config.structure[cat].objects.push(obj);
    }
  }

  map_config.create_iconbutton = function (icon_name, tooltip, callback) {
    //create button
    let btn = document.createElement("BUTTON");
    btn.className = "ui icon inverted toggle button";
    // .dataset[...] is for the tooltip.
    btn.dataset["tooltip"] = tooltip;
    btn.dataset["inverted"] = true;
    btn.dataset["position"] = "top left";
    btn.dataset["delay"] = "500";

    let icon = document.createElement("I");
    icon.className = icon_name + " icon";
    btn.appendChild(icon);
    if (typeof(callback) === "function") {
      btn.onclick = callback;
    }

    return btn;
  };

  map_config.create_buttongroup = function (btnlist, callback) {
    let group = document.createElement("DIV");
    group.className = "ui icon buttons";

    btnlist.forEach(function (item) {
      group.appendChild(item);
    });

    return group;
  };

  //install layout
  window.MapConfig = map_config;
}());


function cb(param) {
  console.log("Clicked!", param);
}
/* tests


let btnlist = [
  MapConfig.create_iconbutton("area chart", "Number of Occurrences", cb),
  MapConfig.create_iconbutton("bar chart", "Bytes Transferred", cb),
  MapConfig.create_iconbutton("line chart", "Packets Transmitted", cb)
];
MapConfig.add_object("Line width represents", null, MapConfig.create_buttongroup(btnlist, cb));

MapConfig.add_object("Show/Hide", null,             MapConfig.create_iconbutton("sign in", "Inbound Connections", cb));
MapConfig.add_object("Show/Hide", null,             MapConfig.create_iconbutton("sign out", "Outbound Connections", cb));
MapConfig.add_object("Show/Hide", null,             MapConfig.create_iconbutton("server", "Pure Servers", cb));
MapConfig.add_object("Show/Hide", null,             MapConfig.create_iconbutton("desktop", "Pure Clients", cb));

btnlist = [
  MapConfig.create_iconbutton("cube", "default", cb),
  MapConfig.create_iconbutton("cube", "nfdump", cb),
  MapConfig.create_iconbutton("cube", "live", cb)
];
MapConfig.add_object("Data Source", null, MapConfig.create_buttongroup(btnlist, cb));

btnlist = [
  MapConfig.create_iconbutton("cube", "Heirarchical", cb),
  MapConfig.create_iconbutton("cubes", "Flat", cb)
];
MapConfig.add_object("Layout", "mode", MapConfig.create_buttongroup(btnlist, cb));

btnlist = [
  MapConfig.create_iconbutton("qrcode", "Address", cb),
  MapConfig.create_iconbutton("table", "Grid", cb),
  MapConfig.create_iconbutton("maximize", "Circle", cb)
];

MapConfig.rebuild();

*/



function init_toggleButton(id, ontext, offtext, isOn) {
    var toggleButton = document.getElementById(id);
    toggleButton.innerHTML = "";
    if (isOn) {
        toggleButton.appendChild(document.createTextNode(ontext));
        toggleButton.classList.add("active");
    } else {
        toggleButton.appendChild(document.createTextNode(offtext));
        toggleButton.classList.remove("active");
    }
    $(toggleButton).state({
        text: {
            inactive: offtext,
            active  : ontext
        }
    });
}

function init_configbuttons() {
    init_toggleButton("show_clients", "Clients Shown", "Clients Hidden", true);
    init_toggleButton("show_servers", "Servers Shown", "Servers Hidden", true);
    init_toggleButton("show_in", "Inbound Shown", "Inbound Hidden", true);
    init_toggleButton("show_out", "Outbound Shown", "Outbound Hidden", true);
    init_toggleButton("update", "Auto refresh", "No refresh", false);
    init_toggleButton("flat", "Flatten subnets", "Use subnets", false);
    $(".ds.toggle.button").state();
    $(".lw.toggle.button").state();
    document.getElementById("links").classList.add("active");
    let active_ds = document.getElementById("ds1");
    active_ds.classList.add("active");
}

function init_canvas(c, cx) {
    var navBarHeight = $("#navbar").height();
    $("#output").css("top", navBarHeight);
    c.width = window.innerWidth;
    c.height = window.innerHeight - navBarHeight;
    cx.lineJoin = "bevel";

    cx.resetTransform();
    let grad = cx.createRadialGradient(c.width / 2, c.height / 2, 0, c.width/2, c.height/2, c.width / 2);
    grad.addColorStop(0, "#99AABB");
    grad.addColorStop(0.4, "#CCEEDD");
    grad.addColorStop(0.45, "#DDFFEE");
    grad.addColorStop(0.55, "#AABBCC");
    grad.addColorStop(1, "#DDFFEE");
    cx.fillStyle = grad;
    cx.globalAlpha = 1.0;
    cx.fillRect(0, 0, c.width, c.height);
}

function toggle_sidebar() {
  $('.ui.sidebar')
    .sidebar('toggle')
  ;
}