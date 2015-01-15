/**
 * Created by Mahmud on 02/01/2015.
 */

var params = {"current_map_level": 1,"min_map_level": 1, "max_map_level": 2,"map_key": "ca","server_script_url":"http://opi.oliverslm.ca/onlinetesting/get_map_data.php","data_filter_form":"data_filter_form"};

var clicked_point_obj = null;
var my_data = null;
var map_data = null;

function getDataFromServer(cml, hckey, filter_data){
    //$("#loading_overlay").css("display","block");
    $("body").addClass("loading");
    $.ajax({
        url: server_script_url + "?" + filter_data + "&current_map_level=" + cml + "&key=" + hckey,
        async : false,
        dataType: "json",
        success: function(data){
            if(data != "") {
                //$("#loading_overlay").css("display","none");
                $("body").removeClass("loading");
                var m_data = data;
                my_data = m_data.data;
                map_data = m_data.map_data;
                loadMapData(map_data, my_data);
                current_map_level = m_data.map_level;
                map_key = m_data.map_key;
            }
        }
    });
}

function applyDataFilter(){
    getDataFromServer(current_map_level, map_key,  $("#"+data_filter_form).serialize());
}

function initParams(params){
    if(localStorage.getItem('map_state') == null) {
        window.current_map_level = params.current_map_level;
        window.min_map_level = params.min_map_level;
        window.max_map_level = params.max_map_level;
        window.map_key = params.map_key;
        window.server_script_url = params.server_script_url;
        window.data_filter_form = params.data_filter_form;
        $("#"+data_filter_form).saveForm("form_vals");
    }
    else{
        restoreState();
    }
}

function hidePopup(){
    $("#point_menu_div").hide();
}

function createPopupMenu(){
    $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("View Detail").addClass("view_detail"));
    $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("Drill Down").addClass("go_down"));
    $("#point_menu_div").prepend($("<a></a>").attr("href","#").text("Go Up").addClass("go_up"));

    $(".go_up").click(function(e){
        goUp(e);
    });

    $(".go_down").click(function(e){
        drillDown(e);
    });

    $(".view_detail").click(function(e){
        e.preventDefault();
        hidePopup();
        saveState();
    });

    if(current_map_level <= min_map_level)
        $(".go_up").hide();

    if(current_map_level >= max_map_level)
        $(".go_down").hide();

    $("#close_link").click(function(){
        hidePopup();
        return false;
    });
}

function updatePopupMenu(){
    if(current_map_level <= min_map_level)
        $(".go_up").hide();
    else
        $(".go_up").show();

    if(current_map_level >= max_map_level)
        $(".go_down").hide();
    else
        $(".go_down").show();
}

function goUp(e){
    //$("#loading_overlay").css("display","block");
    $("body").addClass("loading");
    e.preventDefault();
    hidePopup();
    deleteState();
    $.ajax({
        url: server_script_url + "?" + $("#"+data_filter_form).serialize() + "&action=go_up&current_map_level="+current_map_level+"&key="+map_key,
        async : false,
        dataType: "json",
        success: function(data){
            if(data != "") {
                //$("#loading_overlay").css("display","none");
                $("body").removeClass("loading");
                var m_data = data;
                my_data = m_data.data;
                map_data = m_data.map_data;
                loadMapData(map_data, my_data);
                current_map_level = m_data.map_level;
                map_key = m_data.map_key;
                updatePopupMenu();
            }
        }
    });
}

function drillDown(e){
    //$("#loading_overlay").css("display","block");
    $("body").addClass("loading");
    e.preventDefault();
    hidePopup();
    deleteState();
    $.ajax({
        url: server_script_url + "?" + $("#"+data_filter_form).serialize() + "action=go_down&current_map_level="+current_map_level+"&key="+clicked_point_obj["hc-key"],
        async : false,
        dataType: "json",
        success: function(data){
            if(data != "") {
                //$("#loading_overlay").css("display","none");
                $("body").removeClass("loading");
                var m_data = data;
                my_data = m_data.data;
                map_data = m_data.map_data;
                loadMapData(map_data, my_data);
                current_map_level = m_data.map_level;
                map_key = m_data.map_key;
                updatePopupMenu();
            }
        }
    });
}

function saveState(){
	var obj_to_save = {"current_map_level": current_map_level,"min_map_level": min_map_level, "max_map_level": max_map_level,"map_key": map_key,"server_script_url": server_script_url,"data_filter_form": data_filter_form};
    localStorage.setItem('map_state', JSON.stringify(obj_to_save));
    return false;
}

function restoreState(){
    var retrievedObject = localStorage.getItem('map_state');
    retrievedObject = JSON.parse(retrievedObject);

    window.current_map_level = retrievedObject.current_map_level;
    window.min_map_level = retrievedObject.min_map_level;
    window.max_map_level =retrievedObject.max_map_level;
    window.map_key = retrievedObject.map_key;
    window.server_script_url = retrievedObject.server_script_url;
    window.data_filter_form = retrievedObject.data_filter_form;

    if(localStorage.getItem("form_vals") != null)
        $("#"+data_filter_form).restoreForm("form_vals");
}

function deleteState(){
    localStorage.removeItem('map_state');
}

function loadMapData(map_data, data){
    $('#report_map_div').highcharts('Map', {
        title : {
            text : map_data.title
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        tooltip: {
            backgroundColor: null,
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            formatter: function () {
                return this.point.tooltip;
            }
        },
        chart: {
            plotBackgroundColor: '#666666',
            events: {
                click: function (e) {
                    $("#point_menu_div").css("display","none");
                }
            }
        },
        series : [{
            data : data,
            mapData: map_data,
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            point: {
                events: {
                    click: function (e) {
                        clicked_point_obj = this;
                        $("#point_menu_div").css("display","none");
                        $("#point_menu_div").css("display","block").css("left",e.clientX + "px").css("top",e.clientY+"px");
                    }
                }
            }
        }]
    });
}

$(function(){
    initParams(params);
    getDataFromServer(current_map_level,map_key,$("#"+data_filter_form).serialize());
    createPopupMenu();

    if(data_filter_form) {
        $("#" + data_filter_form).on("submit", function () {
            $("#"+data_filter_form).saveForm("form_vals");
            applyDataFilter();
            return false;
        });
    }
});
