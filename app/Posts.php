<?php
// require_once __DIR__ . '/../vendor/autoload.php';
// $parsedown = new Parsedown();

// // Получаем имя файла из GET запроса
// $postName = $_GET['name'] ?? 'default.md';

// // Полный путь к файлу
// $filePath = "../app/posts/{$postName}";

// if (file_exists($filePath)) {
//     $content = file_get_contents($filePath);
//     echo $parsedown->text($content);
// } else {
//     echo "<p>Пост не найден.</p>";
// }



require_once __DIR__ . '/../vendor/autoload.php';

class Posts {
    private $parsedown;
    private $posts = [];

    public function __construct() {
        $this -> parsedown = new Parsedown();
        $this -> loadPosts();
    }

    private function loadPosts() {
        foreach (glob('../public/posts/*.md') as $filename) {
            $content = file_get_contents($filename);

            $htmlContent = $this -> parsedown -> text($content);

            $this -> posts[] = [
                'name'          => basename($filename),
                'htmlContent'   => $htmlContent,
                'preview'       => substr($htmlContent, 0, 150) . '...'
            ];
        }
    }

    public function getAllPosts() {
        return $this -> posts;
    }

    public function getPostByName($name) {
        foreach ($this -> posts as $post) {
            if ($post['name'] === $name) {
                return $post;
            }
        }

        return null;
    }
}