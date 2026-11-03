<?php

namespace RtEventManager\YOOtheme;

use YOOtheme\Builder\Source;

/**
 * Registers the RT Event Manager dynamic content source with YOOtheme Pro.
 *
 * @see https://yootheme.com/docs/wordpress/developers-sources
 */
class SourceListener
{
    /**
     * @param Source $source
     */
    public static function initSource($source)
    {
        // The event object type (fields a bound element can display).
        $source->objectType('RtemEvent', EventType::config());

        // The query field that returns the collection of events.
        $source->queryType(EventQueryType::config());
    }
}
