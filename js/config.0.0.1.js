var siteHost = {
  home: "http://m.mmia.com",
  search: "http://test.mmia.com",
  debug: false
};
(function() {
  var debug = siteHost.debug,
    ver = "0.0.1",
    $alias = {
      home: "logic/" + (debug ? "home/home." + ver + ".js" : "home/home." + ver + ".min.js"),
      controls: "modules/" + (debug ? "controls/controls." + ver + ".js" : "controls/controls." + ver + ".min.js"),
      interface: "modules/" + (debug ? "interface/interface." + ver + ".js" : "interface/interface." + ver + ".min.js"),
      common: "modules/" + (debug ? "common/common." + ver + ".js" : "common/common." + ver + ".min.js")
    },
    $paths = {
      logic: "js",
      modules: "js/modules"
    },
    $sitePaths = {
      logic: "dist/js",
      modules: "dist/js/modules"
    };

  seajs.config({
    debug: debug,
    charset: "utf-8",
    base: siteHost.home,
    alias: $alias,
    paths: debug ? $paths : $sitePaths
  });
  seajs.use("home");
})();