<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>

<head>  
    <link rel="stylesheet" href="/css/posts.css">
</head>

<?php
include 'header.php'; 
require_once '../app/Posts.php';

$Post = new Posts();
$posts = $Post->getAllPosts();
?>


<main>
    <?php
    foreach ($posts as $post) {
        echo "<div class='post-preview'>";
        echo $post['preview'];
        echo "<div class='openfull'><a href='post.php?name={$post['name']}'>Открыть</a></div>";
        echo "</div>";

    }
    ?>
</main>

<?php include 'footer.php'; ?>
