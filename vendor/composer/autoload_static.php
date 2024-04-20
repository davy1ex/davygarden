<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitb4003305d1e28c1dbf424b3535db855c
{
    public static $prefixLengthsPsr4 = array (
        'D' => 
        array (
            'Davy1ex\\Davygarden\\' => 19,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Davy1ex\\Davygarden\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'P' => 
        array (
            'Parsedown' => 
            array (
                0 => __DIR__ . '/..' . '/erusev/parsedown',
            ),
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitb4003305d1e28c1dbf424b3535db855c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitb4003305d1e28c1dbf424b3535db855c::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitb4003305d1e28c1dbf424b3535db855c::$prefixesPsr0;
            $loader->classMap = ComposerStaticInitb4003305d1e28c1dbf424b3535db855c::$classMap;

        }, null, ClassLoader::class);
    }
}
