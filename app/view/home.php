<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
   <?php 
        include_once "header.php";
        include_once "recent_notes.php";
        include_once __DIR__ . "/../model/post.php";
        $modelPost = new Post();
        $posts = $modelPost->getAllPosts();
        
        foreach($posts as $post) {
            echo "<div class='post-item'> <a> $post[name]; </a> </div>";
        }


   ?>

   
</body>
</html>