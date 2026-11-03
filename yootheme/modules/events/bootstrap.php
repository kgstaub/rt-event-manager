<?php

/**
 * YOOtheme Pro module: RT Event Manager events as a dynamic content source.
 *
 * Loaded by RT Event Manager's main file via
 * YOOtheme\Application::getInstance()->load('.../yootheme/modules/*‍/bootstrap.php')
 * on the after_setup_theme hook (only when YOOtheme Pro is the active theme).
 *
 * The module registers a "source.init" listener that adds an "RtemEvent" object
 * type and a "rtem_events" collection query field to the Builder's dynamic
 * content schema, so List/Grid elements can loop over events and bind fields.
 */

namespace RtEventManager\YOOtheme;

include_once __DIR__ . '/src/SourceListener.php';
include_once __DIR__ . '/src/EventType.php';
include_once __DIR__ . '/src/EventQueryType.php';

return [
    'events' => [
        // Fires before the dynamic content schema is initialised.
        'source.init' => [
            SourceListener::class => ['initSource'],
        ],
    ],
];
