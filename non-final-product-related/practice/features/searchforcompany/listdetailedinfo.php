<?php

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$company_id_list = $request->id;

$pdo = new PDO('mysql:dbname=practice_companies;host=localhost', 'root', null, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

if(count($company_id_list) > 0){
	$q = 'SELECT * FROM companies INNER JOIN companies_detailed ON companies.id = companies_detailed.company_id WHERE companies_detailed.id = "' . $company_id_list[0] . '"';

	if(count($company_id_list) > 1){
		$i = 1;
		do {
			$q .= ' OR companies_detailed.id = "' . $company_id_list[$i] . '"';
			$i ++;
		} while ($i < count($company_id_list));
	}

	$result = $pdo->query($q);
	$rows = $result->fetchAll(PDO::FETCH_ASSOC);
	echo(json_encode($rows));

} else {
	echo("No matches were found");
}

?>