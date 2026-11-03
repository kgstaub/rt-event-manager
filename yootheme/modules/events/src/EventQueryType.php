<?php

namespace RtEventManager\YOOtheme;

/**
 * Adds the "rtem_events" query field to the Builder schema: a collection
 * (listOf RtemEvent) that List/Grid elements can iterate over. An optional
 * "Category" argument filters the collection. The resolver is a string callable
 * (never a closure — closures cannot be serialized into the cached schema).
 */
class EventQueryType
{
    public static function config()
    {
        return [
            'fields' => [
                'rtem_events' => [
                    'type' => ['listOf' => 'RtemEvent'],
                    'args' => [
                        'category' => ['type' => 'String'],
                    ],
                    'metadata' => [
                        'label' => 'RT Events',
                        'group' => 'RT Event Manager',
                        // Builder inputs for the source's arguments.
                        'fields' => [
                            'category' => [
                                'label'   => 'Category',
                                'type'    => 'select',
                                'default' => '',
                                'options' => [
                                    'All events'      => '',
                                    'Pretours'        => 'pretour',
                                    'Day tours'       => 'daytour',
                                    'Official agenda' => 'agenda',
                                ],
                            ],
                        ],
                    ],
                    'extensions' => [
                        'call' => self::class . '::resolveEvents',
                    ],
                ],
            ],
        ];
    }

    /**
     * Resolver for the rtem_events collection. Returns an array of event
     * objects (stdClass) whose properties match the RtemEvent field names.
     *
     * @param mixed $obj
     * @param array $args
     * @param mixed $context
     * @param mixed $info
     * @return array<int,object>
     */
    public static function resolveEvents($obj, $args, $context, $info)
    {
        if (!class_exists('RT_Event_Manager_Account')) {
            return [];
        }

        $events = \RT_Event_Manager_Account::get_events_feed(is_array($args) ? $args : []);

        return array_map(function ($event) {
            return (object) $event;
        }, $events);
    }
}
