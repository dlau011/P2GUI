function makeRenameDialogue(src, filenames) {
    // width = $( window ).width();
    // height = $( window ).height();
    obj = $("#" + src).dialog({
        title: "Rename Files",
        width: 'auto',
        height: 'auto',
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            deleteTaskbarItem("Rename Files");
        }),
        buttons: {
            "OK": function() {
                deleteTaskbarItem("Rename Files");
                // if you click OK it will find the file by its original id and update its name and id
                for (i = 0; i < filenames.length; i++) {
                    $('#'+filenames[i]).html($('#rename_'+i).val());
                    $('#'+filenames[i]+'_dialogue').attr('id', $('#rename_'+i).val()+'_dialogue');
                    $('#'+filenames[i]).attr('id', $('#rename_'+i).val());

                }
                $(this).empty();
                $(this).dialog('destroy');
            },
            "Close": function() {
                deleteTaskbarItem("Rename Files");
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });
    // build the HTML of the dialogue
    html = 'Windows has detected repetetive actions. Would you like the following ' + filenames.length + ' file(s) to be renamed automatically?';
    html += ("<table colspan=3 width='100%'>");
    html += "<thead><tr><th width='45%'>Original</th><th width='10%'></th><th width='45%'>New Filename</th></tr></thead>";
    html += "<tbody>";
    count = 0;
    for (i = 0; i < filenames.length; i++) {
        html +=("<tr class='ui-tr" + (count % 2 == 0 ? " odd'>" : "'>"));
            html +=("<td class='ui-td'>" + filenames[i] + "</td>");
            html +=("<td class='ui-td'>...</td>");
            html +=("<td class='ui-td'>");
                // this input element's value is going to be hard coded to some degree
                // in order to accommodate the user input, we'll have to have a keystroke listener when for these inputs
                // maybe i'll come up with some scenarios we can limit users to
                    // e.g. filename must be split by "." or "-" or "_" and the section of the name the user changes
                    // will trigger the listener to update the other inputs automatically
                html +=("<input id='rename_" + i + "' class='ui-input' type='text' value='" + "renamed_" + i + "'>");
            html +=("</td>");
        html +=("</tr>");
        count++;
    }
    html +=("</tbody></table>");
    obj.html(html);
    obj.dialog('open');
    addTaskbarItem("Rename Files");
}

function renameSingleFileDialogue(src, filename) {
    obj = $("#" + src).dialog({
        title: "Rename File",
        width: 'auto',
        height: 'auto',
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            deleteTaskbarItem("Rename File");
        }),
        buttons: {
            "OK": function() {
                deleteTaskbarItem("Rename File");
                // if you click OK it will find the file by its original id and update its name and id
                for (i = 0; i < filenames.length; i++) {
                    $('#'+filenames[i]).html($('#rename_'+i).val());
                    $('#'+filenames[i]+'_dialogue').attr('id', $('#rename_'+i).val()+'_dialogue');
                    $('#'+filenames[i]).attr('id', $('#rename_'+i).val());
                }
                $(this).empty();
                $(this).dialog('destroy');
            },
            "Close": function() {
                deleteTaskbarItem("Rename File");
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });
    // build the HTML of the dialogue
    html += ("<table colspan=2 width='100%'>");
    html += "<thead><tr><th width='45%'>Original</th><th width='10%'></th><th width='45%'>New Filename</th></tr></thead>";
    html += "<tbody>";
            html +=("<td class='ui-td'>" + filenames[i] + "</td>");
            html +=("<td class='ui-td'>");
            html +=("<input id='" + filename + "' class='ui-input' type='text' value='" + filename + "'>");
            html +=("</td>");
        html +=("</tr>");
    html +=("</tbody></table>");
    obj.html(html);
    obj.dialog('open');
    addTaskbarItem("Rename File");
};

function makeFolderDialogue(folder, objDiv, contentsDiv) {
    obj = $("#" + objDiv).dialog({
        title: folder,
        width: 'auto',
        height: 'auto',
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            $(this).empty();
            $(this).dialog('destroy');
            deleteTaskbarItem(folder);
        })
    });
    contents = $('#'+contentsDiv).clone().children() // have to clone or it will remove them from the original location
    // they aren't draggable when cloned
    $(contents).each(function() {
        $(this).draggable({
            drag: function( event, ui ) {
                var snapTolerance = $(this).draggable('option', 'snapTolerance');
                var topRemainder = ui.position.top % 20;
                var leftRemainder = ui.position.left % 20;

                if (topRemainder <= snapTolerance) {
                    ui.position.top = ui.position.top - topRemainder;
                }

                if (leftRemainder <= snapTolerance) {
                    ui.position.left = ui.position.left - leftRemainder;
                }
            },
            containment: 'document'
        });

    })
    obj.html(contents)
    obj.dialog('open')
    addTaskbarItem(folder);
}

function makeViewerDialogue(filename, dialogueDiv) {
    wwidth = $(window).width()-10;
    wheight = $(window).height();
    iframe = $("<iframe class='ui-iframe' src='../ViewerJS/#../docs/" + filename + "'" + "' allowfullscreen webkitallowfullscreen></iframe>")


    obj = $('#'+dialogueDiv).dialog({
        title: filename,
        width: wwidth*.50,
        height: wheight*.90,
        modal: false,
        resizable: true,
        autoOpen: false,
        close: (function() {
            $(this).empty();
            $(this).dialog('destroy');
            deleteTaskbarItem(filename);
        }),
        resize: (function() {
            $(iframe).css({width: '125%'});
            $(iframe).css({width: '125%'});
        }),
        open: function (event, ui) {
            $(this).css('overflow', 'hidden'); //this line does the actual hiding
        }
    });
    iframe.appendTo(obj)
    obj.dialog('open')
    addTaskbarItem(filename);
}

function makeNotepadDialogue() {

}

// TASKBAR SHOW/HIDE

function addTaskbarItem(name) {
    var newItem = "<span class='taskbar-item'>"+ name +"</span>";
    $('#taskbar').append(newItem);
}

function deleteTaskbarItem(name) {
    var deleteItem = $('#taskbar > span:contains("'+ name +'")');
    deleteItem.remove();
}

// function toggleTaskbarItem() {
//     $('#startMenu').toggle()
// }

// CUSTOM RIGHT CLICK MENU

// Trigger action when the contexmenu is about to be shown
$(document).bind("contextmenu", function (event) {

    // Avoid the real one
    event.preventDefault();

    // Show contextmenu
    $(".rightclick-menu").finish().toggle(100).

    // In the right position (the mouse)
    css({
        top: event.pageY + "px",
        left: event.pageX + "px"
    });
});

// If the document is clicked somewhere
$(document).bind("mousedown", function (e) {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".rightclick-menu").length > 0) {

        // Hide it
        $(".rightclick-menu").hide(100);
    }
});

// If the menu element is clicked
$(".rightclick-menu li").click(function(){

    // This is the triggered action name
    switch($(this).attr("data-action")) {

        // A case for each action. Your actions here
        case "rename":
            renameSingleFileDialogue(src, filename);
            break;
        // case "second": alert("second"); break;
        // case "third": alert("third"); break;
    }

    // Hide it AFTER the action was triggered
    $(".rightclick-menu").hide(100);
});
