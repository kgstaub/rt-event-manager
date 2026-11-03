<?php

namespace RtEventManager\YOOtheme;

/**
 * The "RtemEvent" object type: the fields a YOOtheme Pro element can bind to
 * for a single event. Field names are snake_case and match the array keys
 * produced by RT_Event_Manager_Account::get_events_feed() so the default
 * resolver (which reads a property of the same name) returns their values
 * without a per-field resolver.
 */
class EventType
{
    public static function config()
    {
        return [
            'metadata' => [
                'label' => 'RT Event',
                'type'  => true,
            ],
            'fields' => [
                'title'          => ['type' => 'String', 'metadata' => ['label' => 'Title']],
                'category'       => ['type' => 'String', 'metadata' => ['label' => 'Category (slug)']],
                'category_label' => ['type' => 'String', 'metadata' => ['label' => 'Category']],
                'date_range'     => ['type' => 'String', 'metadata' => ['label' => 'Date & time']],
                'start_date'     => ['type' => 'String', 'metadata' => ['label' => 'Start date']],
                'start_time'     => ['type' => 'String', 'metadata' => ['label' => 'Start time']],
                'end_date'       => ['type' => 'String', 'metadata' => ['label' => 'End date']],
                'end_time'       => ['type' => 'String', 'metadata' => ['label' => 'End time']],
                'start_iso'      => ['type' => 'String', 'metadata' => ['label' => 'Start (ISO 8601)']],
                'end_iso'        => ['type' => 'String', 'metadata' => ['label' => 'End (ISO 8601)']],
                'location'       => ['type' => 'String', 'metadata' => ['label' => 'Location']],
                'url'            => ['type' => 'String', 'metadata' => ['label' => 'URL']],
            ],
        ];
    }
}
