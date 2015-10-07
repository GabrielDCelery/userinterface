<?php
require("../settings.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$company_name = $request->companyName;
$manager_name = $request->managerName;
$valid_contract = $request->validContract;
$expired_contract = $request->expiredContract;
$starting_date = $request->startingDate;
$ending_date = $request->endingDate;

if($starting_date > $ending_date){
	$temp_date = $starting_date;
	$starting_date = $ending_date;
	$ending_date = $temp_date;
}

if(!is_null($starting_date)){
	$starting_date = strtotime($starting_date);
	$starting_date = date('Y-m-d', $starting_date);
}
if(!is_null($ending_date)){
	$ending_date = strtotime($ending_date);
	$ending_date = date('Y-m-d', $ending_date);
}

$last_contract_only = $request->lastContractOnly;

$q = 'SELECT
	companies_detailed.id AS company_id,
	company_name,
	contract_status,
	company_email,
	company_phone,
	starting_date,';

if ($last_contract_only == true){
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

if ($manager_name !== ""){
	$q .= ' AND manager_name = "' . $manager_name . '" ';
}

if ($starting_date !== null){
	$q .= ' AND ending_date >= "' . $starting_date . '" ';
}

if ($ending_date !== null){
	$q .= ' AND ending_date <= "' . $ending_date . '" ';
}

if ($valid_contract == true && $expired_contract == true){
	$q .= ' AND companies.contract_status = true OR companies.contract_status = false';
} elseif ($valid_contract == true && $expired_contract == false){
	$q .= ' AND companies.contract_status = true ';
} elseif ($valid_contract == false && $expired_contract == true){
	$q .= ' AND companies.contract_status = false ';	
} else {
	$q .= ' AND companies.contract_status = true AND companies.contract_status = false';	
}

if ($last_contract_only == true){
	$q .= ' GROUP BY companies.id';
}

$result = $pdo->query($q);
$rows = $result->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($rows));

?>