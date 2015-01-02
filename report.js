/**
 * Created by Mahmud on 02/01/2015.
 */
var my_data = [{"hc-key": "ca-ab","name":"Alberta","value": 1},{"hc-key": "ca-bc","name":"British Columbia","value": 2}, {"hc-key": "ca-mb","name":"Manitoba","value":3}, {"hc-key": "ca-nb","name":"New Brunswick","value": 4}, {"hc-key": "ca-nl","name":"Newfoundland and Labrador","value": 5}, {"hc-key": "ca-ns","name":"Nova Scotia","value": 6}, {"hc-key": "ca-nt","name":"Northwest Territories","value": 7}, {"hc-key": "ca-nu","name":"Nunavut","value": 8}, {"hc-key": "ca-on","name":"Ontario","value": 9}, {"hc-key": "ca-pe","name":"Prince Edward Island","value": 10}, {"hc-key": "ca-qc","name":"Quebec","value": 11}, {"hc-key": "ca-sk","name":"Saskatchewan","value": 12}, {"hc-key": "ca-yt","name":"Yukon","value": 13}];

var map_data = Highcharts.maps["countries/ca/ca-all"];

function showKeys(obj){
    console.log(Object.keys(obj));
}

function loadMapData(map_data, data){
    $('#report_map_div').highcharts('Map', {
        title : {
            text : 'Highmaps map selector'
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
            formatter: function () {
                return 'Area Name: ' + this.point.name + '<br>' + 'Value: ' + this.point.value;
            }
        },
        chart: {
            plotBackgroundColor: '#666666'
            /*events: {
                click: function (e) {
                    var x = Math.round(e.xAxis[0].value),
                        y = Math.round(e.yAxis[0].value);
                    alert(x + ', ' + y);
                }
            }*/
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
                        //alert(e.clientX + ', '+ e.clientY);
                        $("#point_menu_div").css("display","none");
                        $("#point_menu_div").css("display","block").css("left",e.clientX + "px").css("top",e.clientY+"px");
                        /*var text = '<b>Clicked point</b><br>Series: ' + this.series.name +
                                '<br>Point: ' + this.name + ' (' + this.value + ')'
                            chart = this.series.chart;
                        if (!chart.clickLabel) {
                            chart.clickLabel = chart.renderer.label(text, 0, 250)
                                .css({
                                    width: '180px'
                                })
                                .add();
                        } else {
                            chart.clickLabel.attr({
                                text: text
                            });
                        }*/
                    }
                }
            }
        }]
    });
}

$(function(){
    $("#close_link").click(function(){
        $("#point_menu_div").css("display","none");
        return false;
    });
    loadMapData(map_data, my_data);
});
