<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); 
?>

<head>
    <link rel="stylesheet" href="css/posts.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>

</head>
<?php
require_once 'header.php';
require_once '../app/Posts.php';




$Posts = new Posts();
$postName = $_GET['name'] ?? 'default.md';
$post = $Posts->getPostByName($postName);





if ($post) {
    echo $post['htmlContent'];
}
else {
    echo "404 :с";
}

?>
<script>hljs.highlightAll();</script>
