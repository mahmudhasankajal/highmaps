<?php
	require_once('include/h.inc.php');

	$db->query("SET NAMES 'utf8'");

	if(isset($_GET['action'])) {
		if($_GET['action'] == "go_up"){
			echo moveUp($_GET['key']);
		}
		elseif($_GET['action'] == "go_down")
			echo drillDown($_GET['key']);
		elseif($_GET['action'] == "show_list")
			echo showTabularData();
	}
	else
		echo initMap($_GET['key']);

	function initMap($key){
		global $db;
		$min_level  = 1;

		$res = $db->query("select * from map_data where hc_key = '$key'");
		if($db->num_rows($res) > 0){
			$row = $db->fetch_object($res);
			$map_data = $row->map_data;
			$map_key = $row->hc_key;
			$map_level = $row->level;

			$res = $db->query("select * from map_data where parent_hc_key = '" . $row->hc_key . "'");
			$data = array();
			while($row = $db->fetch_object($res)){
				$value = getUserData($row->hc_key);
				$tooltip = "<div class=\"tooltip_container\"><h4 class=\"tooltip_header\">" . $row->title . "</h4>";
				$tooltip .= "<p class=\"tooltip_data\">$value</p></div>";
				$data[] = array("level"=>$row->level,"tooltip"=>$tooltip,"title"=>$row->title, "hc-key"=>$row->hc_key,"id"=>$row->id,"value"=>$value);
			}

			return "{\"map_level\":$map_level,\"map_key\":\"$map_key\",\"map_data\":$map_data,\"data\":" . json_encode($data) . "}";
		}

		return "";
	}

	function drillDown($key){
		global $db;

		$res = $db->query("select * from map_data where hc_key = '$key' and map_data is not null");
		if($db->num_rows($res) > 0){
			$row = $db->fetch_object($res);
			$map_data = $row->map_data;
			$map_key = $row->hc_key;
			$map_level = $row->level;

			$res = $db->query("select * from map_data where parent_hc_key = '$map_key'");
			$data = array();
			while($row = $db->fetch_object($res)){
				$value = getUserData($row->hc_key);
				$tooltip = "<div class=\"tooltip_container\"><h4 class=\"tooltip_header\">" . $row->title . "</h4>";
				$tooltip .= "<p class=\"tooltip_data\">$value</p></div>";
				$data[] = array("tooltip"=>$tooltip,"title"=>$row->title, "hc-key"=>$row->hc_key,"id"=>$row->id,"value"=>$value);
			}

			return "{\"map_level\":$map_level,\"map_key\":\"$map_key\",\"map_data\":$map_data,\"data\":" . json_encode($data) . "}";
		}

		return "";
	}

	function moveUp($key){
		global $db;
		$res = $db->query("select parent_hc_key from map_data where hc_key = '$key' and parent_hc_key is not null");
		if($db->num_rows($res) > 0){
			$row = $db->fetch_object($res);
			$parent_key = $row->parent_hc_key;
			$res = $db->query("select * from map_data where hc_key = '$parent_key'");
			$row = $db->fetch_object($res);
			$map_data = $row->map_data;
			$map_key = $row->hc_key;
			$map_level = $row->level;
			$res = $db->query("select * from map_data where parent_hc_key = '" . $row->hc_key . "'");
			$data = array();
			while($row = $db->fetch_object($res)){
				$value = getUserData($row->hc_key);
				$tooltip = "<div class=\"tooltip_container\"><h4 class=\"tooltip_header\">" . $row->title . "</h4>";
				$tooltip .= "<p class=\"tooltip_data\">$value</p></div>";
				$data[] = array("tooltip"=>$tooltip,"title"=>$row->title, "hc-key"=>$row->hc_key,"id"=>$row->id,"value"=>$value);
			}

			return "{\"map_level\":$map_level,\"map_key\":\"$map_key\",\"map_data\":$map_data,\"data\":" . json_encode($data) . "}";
		}
		return "";
	}

	function dump2($v){
		echo "<pre>";
		var_dump($v);
		echo "</pre>";
	}

	function getUserData($hc_key){
		global $db;

		$data_filter = array();
		if(isset($_GET['date_from']) && trim($_GET['date_from']) != "")
			$data_filter[] = "joining_date >= '" . trim($_GET['date_from']) . "'";
		if(isset($_GET['date_to']) && trim($_GET['date_to']) != "")
			$data_filter[] = "joining_date <= '" . trim($_GET['date_to']) . "'";

		$status_filter = "";
		switch($_GET['status_cb']){
			case "all":
				break;
			case "active":
				$data_filter[] = "datediff(now(),last_login_time) <= 15";
				break;
			case "inactive":
				$data_filter[] = "datediff(now(),last_login_time) > 15";
				break;
			case "completed":
				$data_filter[] = "perc_completed = 100";
		}

		$data_filter[] = "(h2 = '$hc_key' OR h3 = '$hc_key')";

		$data_filter_string = implode(" AND ",$data_filter);

		$res = $db->query("select count(user_id) as cnt from dummy_users where $data_filter_string");
		$row = $db->fetch_object($res);
		return $row->cnt;
	}

	function showTabularData(){
		global $db;

		$data_filter = array();
		if(isset($_GET['date_from']) && trim($_GET['date_from']) != "")
			$data_filter[] = "joining_date >= '" . trim($_GET['date_from']) . "'";
		if(isset($_GET['date_to']) && trim($_GET['date_to']) != "")
			$data_filter[] = "joining_date <= '" . trim($_GET['date_to']) . "'";

		$status_filter = "";
		switch($_GET['status_cb']){
			case "all":
				break;
			case "active":
				$data_filter[] = "datediff(now(),last_login_time) <= 15";
				break;
			case "inactive":
				$data_filter[] = "datediff(now(),last_login_time) > 15";
				break;
			case "completed":
				$data_filter[] = "perc_completed = 100";
		}

		$data_filter[] = "(h2 = '$hc_key' OR h3 = '$hc_key')";

		$data_filter_string = implode(" AND ",$data_filter);

		$res = $db->query("select count(user_id) as cnt from dummy_users where $data_filter_string");
		$row = $db->fetch_object($res);
		return $row->cnt;
	}