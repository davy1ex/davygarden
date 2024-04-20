<?php
require_once __DIR__ . "/../../vendor/autoload.php";


class Post {
    private $parsedown;


    public function __construct() {
        $this -> parsedown = new Parsedown;
    }

    public function getAllPosts() {
        $posts = array();

        foreach (glob('../public/posts/pages/*.md') as $filename) {
            $content = file_get_contents($filename);
            $htmlContent = $this->parsedown->text($content);

            $posts[] = [
                'name'          => basename($filename),
                'htmlContent'   => $htmlContent,
                'preview'       => substr($htmlContent, 0, 150) . '...'
            ];
        }

        return $posts;
    }

    function gatPostByName() {
        foreach (glob('../public/posts/*.md') as $filename) {
            echo $filename;
        }
    }
}

