<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); 

require_once '../app/Posts.php';
require_once 'header.php';

$Posts = new Posts();
$postName = $_GET['name'] ?? 'default.md';
$post = $Posts->getPostByName($postName);





if ($post) {
    echo $post['htmlContent'];
}
else {
    echo "404 :с";
}