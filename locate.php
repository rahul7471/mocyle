<?php 
require_once './db.php'; 
if(isset($_POST['cuslat']) && isset($_POST['cuslng']) ){

// The mysql database connection script
$lat = $_POST['cuslat'];
$lan = $_POST['cuslng'];
$created = time();

$query="INSERT INTO `AllCustomerGeo`(`lat`, `lan`,`hit_time`)  VALUES ('$lat', '$lan','$created')";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$result = $mysqli->affected_rows;

echo $json_response = json_encode($result);
}
?>