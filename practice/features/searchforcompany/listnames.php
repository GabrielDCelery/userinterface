<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$company_name = $request->searchName;
$valid_contract = $request->validContract;
$expired_contract = $request->expiredContract;
$starting_date = $request->startingDate;
$ending_date = $request->endingDate;
$unique_results = $request->uniqueResults;

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$q = 'SELECT
	companies_detailed.id AS company_id,
	company_name,
	status,
	company_email,
	company_phone,
	starting_date,';

if ($unique_results == true){
	$q .= ' MAX(ending_date) AS ending_date, ';
} else {
	$q .= ' ending_date, ';
}

$q .= ' postal_number
	FROM companies
	INNER JOIN companies_detailed
	ON companies.id = companies_detailed.company_id';

if ($company_name !== ""){
	$q .= ' WHERE company_name = "' . $company_name . '"';
} else {
	$q .= ' WHERE 1';
}

if ($starting_date !== null){
	$q .= ' AND ending_date >= "' . $starting_date . '" ';
}

if ($ending_date !== null){
	$q .= ' AND ending_date <= "' . $ending_date . '" ';
	/*$q .= ' AND "' . $ending_date . '" >= ending_date ';*/
}

if ($valid_contract == true && $expired_contract == true){
	$q .= ' AND companies.status = true OR companies.status = false';
} elseif ($valid_contract == true && $expired_contract == false){
	$q .= ' AND companies.status = true ';
} elseif ($valid_contract == false && $expired_contract == true){
	$q .= ' AND companies.status = false ';	
} else {
	$q .= ' AND companies.status = true AND companies.status = false';	
}

if ($unique_results == true){
	$q .= ' GROUP BY companies.id';
}

$result = $pdo->query($q);
$rows = $result->fetchAll();
echo(json_encode($rows));

?>