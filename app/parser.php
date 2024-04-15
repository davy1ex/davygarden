<?php

// app/parser.php
require_once __DIR__ . '/../vendor/autoload.php';

// require_once "../vendor/Parsedown.php";

function parseMarkdownFromFile($filePath) {
    $parsedown = new Parsedown();
    $content = file_get_contents($filePath);
    return $parsedown->text($content);
}
