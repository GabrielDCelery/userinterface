<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$company_id = $request->company_id;
$company_name = $request->company_name;
$contract_status = $request->contract_status;
$id = $request->id;

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$q1 = 'UPDATE practice_companies.companies_detailed SET ';

foreach($request as $key => $value){
	if($key != "id" && $key != "company_id" && $key != "company_name" && $key != "contract_status" && $key != "css_color"){
		$q1 .= $key . ' = ' . '"' . $value . '"' . ', ';
	}
}

$q1 = substr($q1, 0, -2);
$q1 .= ' WHERE companies_detailed.id = ';
$q1 .= $id;

$q2 = 'UPDATE practice_companies.companies SET company_name = "' . $company_name . '" WHERE companies.id = ' . $company_id;

$pdo->query($q1);
$pdo->query($q2);

echo("Data updated");

?>