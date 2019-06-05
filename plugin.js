define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "ui", "commands", "menus"
    ];
    main.provides = ["beagle.bone101"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var commands = imports.commands;
        var menus = imports.menus;

        /***** Initialization *****/
        
        var plugin = new Plugin("Ajax.org", main.consumes);
        var emit = plugin.getEmitter();
        
        function load() {
            commands.addCommand({
                name: "bone101",
                isAvailable: function(){ return true; },
                exec: function() {
                    alert("bone101!");
                }
            }, plugin);

            menus.addItemByPath("BeagleBone", null, 60, plugin);
            menus.addItemByPath("BeagleBone/bone101", new ui.item({
                command: "bone101"
            }), 62, plugin);
        }
        
        /***** Methods *****/
        
        
        
        /***** Lifecycle *****/
        
        plugin.on("load", function() {
            load();
        });
        plugin.on("unload", function() {
        
        });
        
        /***** Register and define API *****/
        
        plugin.freezePublicAPI({
            
        });
        
        register(null, {
            "beagle.bone101": plugin
        });
    }
});