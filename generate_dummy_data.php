<?php
/**
 * Created by PhpStorm.
 * User: Mahmud
 * Date: 15/01/2015
 * Time: 10:36 AM
 */

    //require_once('include/h.inc.php');

    $provinces = array("ca-on","ca-qc");
    $locations = array("ca-on"=>array("ca-on-3520","ca-on-3543","ca-on-3552","ca-on-3516","ca-on-3560"),"ca-qc"=>array("ca-qc-2466","ca-qc-2423"));

    $names = array("Agretha Sykes","Alexina Aron","Almeda Hungerford","Alvira Aisner","Angel Kiebuzinski","Arlene Ray","Ashil Bamford","Babara Mintz","Bernie Sisler","Berny Przekop","Berti Meller","Bethena Voss","Bran Mintz","Brice Flournoy","Brock Champion","Byram Bridges","Byran Birnir","Camel Stuppard-leung","Caralie Birnir","Cherie Rodgers","Cindy Dalleore","Claudina Kiely","Clem Bamford","Colan Brookes","Culver Kiely","Deanne Flournoy","Domenico Wetmore","Doria First","Dougy Wieneke","Duncan Sailer","Dyana Cohen","Eadie Saragosa","Eddy Quaye","Eleen Leibensperger","Ellary Fountain","Emilie Josselson","Engracia Gokgur","Enid Vanmiddlesworth","Enrico Scialabba","Erin Scialabba","Freddy Cole","Gibb Aron","Haleigh Pelikan","Hanny Govern","Harwell Marliani","Henriette Hartman","Hodge Nakkula","Hope Mitnick","Huntley Goff","Izak Spreadbury","Jamesy Viana","Jarred Harbron","Joela Katsos","Johnny Pelikan","Kaila Ristich","Kaitlyn Kirkman","Katherine Sartell","Keen Dressler","Kennie Hungerford","Kermie Mann","Kerrin Dressler","Kienan Mahood","Kirby Milenkovic","Konstanze Travers","Leland Basavappa","Lenci Luby","Lewes Bissen","Lind Higonnet","Lothaire Adam","Lynnet Wiltse","Maddie Fountain","Mahala Schreiber","Marcellus Jeffery","Marris Alcantar","Marty D'ambra","Melva Solc","Meredeth Voss","Mirna Dollar","Myrwyn Dalle ore","Nealson Boisse-kilgo","Nettle Goff","Nicolas Hawke","Noami Godoy","Pauli Jackman","Pierce Fries","Pincus Mcvey","Quentin Friar","Rafe Jee","Raine Sahiner","Raoul Prosser","Regan Kramer","Renaud Collier","Rori Olivier","Roseann Eckehard","Roxi Macgillivray","Rudolfo Cowper","Seana Spreadbury","Serge Towne","Sheffy Rodgers","Shermy Dollar","Shirlene Fries","Standford Nostrand","Taddeo Varraso","Tedie Sandel","Temp Vorhaus","Teresa Fazio","Tiffany Stiller","Timothy Macgillivray","Torey Daigneau","Vinson Vecchio","Violetta Bethell","Winifield Blout","Zacharia Ferrara");

    function randomDateTime($from, $to){
        $int = mt_rand(strtotime($from),strtotime($to));
        return date("Y-m-d H:i:s",$int);
    }

    shuffle($names);
    foreach($names as $name){
        $name_parts = explode(" ",$name);
        $fname = $name_parts[0];
        $lname = $name_parts[count($name_parts)-1];
        $email = strtolower($fname . "." . $lname . "@abc.com");
        $joining_date = substr(randomDateTime("2014-01-01","2014-12-31"),0,10);
        $perc_completed1 = mt_rand(0,18) * 2 + mt_rand(0,10)*5;
        $perc_completed2 = ($perc_completed1 == 86) ? mt_rand(0,1)*14 : 0;
        $total_completed = $perc_completed1 + $perc_completed2;
        $completion_date = $total_completed == 100 ? date("Y-m-d",strtotime($joining_date) + mt_rand(10,60) * 86400) : "0000-00-00";
        shuffle($provinces);
        $prov = $provinces[0];
        $locations_in_prov = $locations[$prov];
        shuffle($locations_in_prov);
        $loc = $locations_in_prov[0];
        $last_login_time = randomDateTime($joining_date, date("Y-m-d"));

        echo "0,$fname,$lname,$email,$joining_date,$prov,$loc,$last_login_time,$total_completed,$completion_date\r\n";
    }