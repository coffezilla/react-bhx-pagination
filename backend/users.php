<?php
// access
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT');
header('Access-Control-Allow-Headers: Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//conecta ao banco
error_reporting(0);
date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json; charset=UTF-8');

// fake data from the server
$dataResponse = array();

// pagination controller
$currentPage = addslashes(trim($_GET['page']));
$resultsPerPage = addslashes(trim($_GET['perpage']));
$indexInitSearch = ($resultsPerPage*$currentPage)-$resultsPerPage;

$dbResults = array(
's1',
's2',
's3',
's4',
's5',
's6',
's7',
's8',
// 's9',
// 's10',
// 's11',
// 's12',
// 's13',
// 's14',
// 's15',
// 's16',
// 's17',
// 's18',
// 's19',
// 's20',
// 's21',
// 's22',
// 's23',
// 's24',
// 's25',
// 's26',
// 's27',
// 's28',
// 's29',
// 's30',
// 's31',
// 's32',
// 's33',
// 's34',
// 's35',
// 's36',
// 's37',
// 's38',
// 's39',
// 's40',
// 's41',
// 's42',
// 's43',
// 's44',
// 's45',
// 's46',
// 's47',
// 's48',
// 's49',
// 's50',
// 's51',
// 's52',
// 's53',
// 's54',
// 's55',
// 's56',
// 's57',
// 's58',
// 's59',
// 's60',
// 's61',
// 's62',
// 's63',
// 's64',
// 's65',
// 's66',
// 's67',
// 's68',
// 's69',
// 's70',
// 's71',
// 's72',
// 's73',
// 's74',
// 's75',
// 's76',
// 's77',
// 's78',
// 's79',
// 's80',
// 's81',
// 's82',
// 's83',
// 's84',
// 's85',
// 's86',
// 's87',
// 's88',
// 's89',
// 's90',
// 's91',
// 's92',
// 's93',
// 's94',
// 's95',
// 's96',
// 's97',
// 's98',
// 's99',
// 's100',
// 's101',
// 's102',
// 's103',
// 's104',
// 's105',
// 's106',
// 's107',
// 's108',
// 's109',
// 's110',
// 's111',
// 's112',
// 's113',
// 's114',
// 's115',
// 's116',
// 's117',
// 's118',
// 's119',
// 's120',
// 's121',
// 's122',
// 's123',
// 's124',
// 's125',
// 's126',
// 's127',
// 's128',
// 's129',
// 's130',
// 's131',
// 's132',
// 's133',
// 's134',
// 's135',
// 's136',
// 's137',
// 's138',
// 's139',
// 's140',
// 's141',
// 's142',
// 's143',
// 's144',
// 's145',
// 's146',
// 's147',
// 's148',
// 's149',
// 's150',
// 's151',
// 's152',
// 's153',
// 's154',
// 's155',
// 's156',
// 's157',
// 's158',
// 's159',
// 's160',
// 's161',
);

// pages result
// if($currentPage == 1) {

$dataResponse["users"] = array_slice($dbResults, $indexInitSearch, $resultsPerPage);

// }
// if($currentPage == 2) {
// 	$dataResponse["users"] = array("s4", "s5", "s6");
// }
// if($currentPage == 3) {
// 	$dataResponse["users"] = array("s7", "s8", "s9");
// }
// if($currentPage == 4) {
// 	$dataResponse["users"] = array("s10", "s11", "s12");
// }
// if($currentPage == 5) {
// 	$dataResponse["users"] = array("s13", "s14", "s15");
// }
// if($currentPage == 6) {
// 	$dataResponse["users"] = array("s16", "s17");
// }

$dataResponse["results"] = count($dbResults);

$resultadosJson = json_encode($dataResponse);
echo $resultadosJson;

