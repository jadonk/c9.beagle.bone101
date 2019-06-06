define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "ui", "commands", "menus", "tabManager",
        "Previewer", "Editor", "editors", "layout", "settings"
    ];
    main.provides = ["beagle.bone101"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var commands = imports.commands;
        var menus = imports.menus;
        var tabManager = imports.tabManager;
        var Previewer = imports.Previewer;
        var Editor = imports.Editor;
        var editors = imports.editors;
        var layout = imports.layout;
        var settings = imports.settings;
        var path = require("path");

        var basename = path.basename;
        var extensions = ["bone101"];
        var handle = editors.register("bone101", "Bone101", Bone101Editor, extensions);
        console.log("editors: " + JSON.stringify(editors));
        var BGCOLOR = {
            "flat-light": "#F1F1F1",
            "light": "#D3D3D3",
            "light-gray": "#D3D3D3",
            "dark": "#3D3D3D",
            "dark-gray": "#3D3D3D"
        };

        function Bone101Editor(){
            console.log("bone101: build editor");
            var plugin = new Editor("BeagleBoard.org", main.consumes, extensions);

            var container, contents;
            var currentSession, currentDocument;

            plugin.on("draw", function(e) {
                console.log("bone101: draw");
                container = e.htmlNode;

                // Insert the UI
                ui.insertHtml(container, require("text!./plugin.bone101"), plugin);

                /*
                contents = container.querySelector(".contents");

                // Set the scroll state on the session when it changes.
                contents.addEventListener("scroll", function(){
                    currentSession.scrollLeft = this.scrollLeft;
                    currentSession.scrollTop = this.scrollTop;
                });
                */
            });

            function renderOnCanvas(){}
            function serializeValue(){}
            function getSerializedSelection(){}

            plugin.on("documentLoad", function(e){
                console.log("bone101: documentLoad");
                var doc = e.doc;
                var session = doc.getSession();

                doc.on("setValue", function get(e) {
                    renderOnCanvas(e.value, session.canvas);
                }, session);

                doc.on("getValue", function get(e) {
                    return doc.changed
                        ? serializeValue(session)
                        : e.value;
                }, session);

                doc.tab.on("setPath", setTitle, session);
                function setTitle(e) {
                    doc.title = "bone101";
                    doc.tooltip = "bone101";
                }
                setTitle();

                function setTheme(e) {
                    var tab = doc.tab;
                    var isDark = e.theme == "dark";

                    tab.backgroundColor = BGCOLOR[e.theme];

                    if (isDark) tab.classList.add("dark");
                    else tab.classList.remove("dark");
                }

                layout.on("themeChange", setTheme, session);
                setTheme({ theme: settings.get("user/general/@skin") });

                // Define a way to update the state for the session
                session.update = function(){
                    /*
                    contents.scrollTop = session.scrollTop;
                    contents.scrollLeft = session.scrollLeft;

                    // Set the canvas element to be displayed
                    contents.appendChild(currentSession.canvas);
                    */
                };

                session.canvas = document.createElement("canvas");
            });
            plugin.on("documentActivate", function(e){
                console.log("bone101: documentActivate");
                currentDocument = e.doc;
                currentSession = e.doc.getSession();

                /*
                // Remove a previous canvas element, if any
                if (contents.firstChild)
                    contents.removeChild(contents.firstChild);
                */

                // Call the update function when this session becomes active
                currentSession.update();
            });
            plugin.on("documentUnload", function(e){
                console.log("bone101: documentUnload");
                var doc = e.doc;
                var session = doc.getSession();

                if (session.canvas.parentNode)
                    session.canvas.parentNode.removeChild(session.canvas);
                delete session.canvas;
            });
            plugin.on("cut", function(e) {
                var data = getSerializedSelection();
                e.clipboardData.setData("text/plain", data);
            });
            plugin.on("getState", function(e) {
                var session = e.doc.getSession();

                e.state.scrollTop = session.scrollTop;
                e.state.scrollLeft = session.scrollLeft;
            });
            plugin.on("setState", function(e) {
                var session = e.doc.getSession();

                session.scrollTop = e.state.scrollTop;
                session.scrollLeft = e.state.scrollLeft;

                if (session == currentSession)
                    session.update();
            });
            plugin.on("focus", function(){
                //contents.className = "contents focus";
            });
            plugin.on("blur", function(){
                //contents.className = "contents";
            });
            plugin.on("resize", function(){
                //contents.style.width = (contents.parentNode.offsetWidth - 2) + "px";
            });
            plugin.freezePublicAPI({

            });
            plugin.load(null, "beagle.bone101");
            return plugin;
        }

        handle.on("load", function(){
            console.log("bone101: load");
            commands.addCommand({
                name: "bone101",
                isAvailable: function(){ return true; },
                exec: function() {
                    bone101();
                }
            }, handle);

            menus.addItemByPath("BeagleBone", null, 60, handle);
            menus.addItemByPath("BeagleBone/bone101", new ui.item({
                command: "bone101"
            }), 62, handle);
        });

        function bone101() {
            var filename = options.packagePath + ".bone101";
            //var filename = 'http://192.168.6.2:3000/vfs/1/9cwLa0wuI72UZjWD/home/.c9/plugins/beagle.bone101/plugin.html';
            //var filename = "http://192.168.6.2";
            console.log("opening " + filename);
            var tab = tabManager.open({
                "path": filename,
                "editorType": "bone101",
                "title": "bone101",
                "tooltip": "bone101"
            }, function(err, tab){
                if (err) return console.error(err);
            });
            //console.log("getting doc");
            //var doc = tab.document;
            //console.log("getting session");
            //var session = doc.getSession();
            //console.log("creating iframe");
            //session.iframe = document.createElement("iframe");

            /*doc.on("setValue", function get(e) {
                console.log("setting url");
                session.iframe.src = "//:3000";
            }, session);*/
        }

        register(null, {
            "beagle.bone101": handle
        });
    }
});