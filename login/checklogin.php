<?php

if(!isset($_SESSION)) { 
	session_start();
}

if(isset($_SESSION['login_username']) && isset($_SESSION['login_password'])){
	echo("true");
} else {
	echo("false");
}

?>