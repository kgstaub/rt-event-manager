/**
 * RTI Badge Template Admin JavaScript
 *
 * Handles media library integration, form saving, and live preview
 * for the badge template settings page.
 *
 * @package RT_Event_Manager
 * @since 1.3.0
 */

(function($) {
    'use strict';

    // Check if we're on the badge template page
    if (typeof rtiBadgeAdmin === 'undefined') {
        return;
    }

    /**
     * Badge Template Admin Controller
     */
    var BadgeAdmin = {
        // Media frame instance
        mediaFrame: null,

        // Preview scale factor (preview width / actual width in mm)
        previewScale: 2, // 210px / 105mm = 2

        // Sample data for preview
        sampleData: {
            holder_name: 'John Doe',
            country: 'Germany',
            rti_family: 'Round Table',
            rti_club: 'RT 123 Example City',
            qr_code: '[QR Code]',
            combination: 'FW: ✓ | Fr: ✓ | Sa: ✓ | PT: —'
        },

        /**
         * Initialize the controller
         */
        init: function() {
            this.bindEvents();
            this.updatePreview();
        },

        /**
         * Bind event handlers
         */
        bindEvents: function() {
            var self = this;

            // Background image selection
            $('#select-background-btn').on('click', function(e) {
                e.preventDefault();
                self.openMediaLibrary();
            });

            // Remove background image
            $('#remove-background-btn').on('click', function(e) {
                e.preventDefault();
                self.removeBackgroundImage();
            });

            // Field enable/disable toggle
            $('.rti-field-enabled').on('change', function() {
                var $section = $(this).closest('.rti-field-section');
                var $options = $section.find('.rti-field-options');

                if ($(this).is(':checked')) {
                    $options.slideDown(200);
                } else {
                    $options.slideUp(200);
                }

                self.updatePreview();
            });

            // Field settings change - update preview
            $('#rti-badge-template-form').on('change', 'input, select', function() {
                self.updatePreview();
            });

            // Form submission
            $('#rti-badge-template-form').on('submit', function(e) {
                e.preventDefault();
                self.saveSettings();
            });
        },

        /**
         * Open WordPress media library
         */
        openMediaLibrary: function() {
            var self = this;

            // Create media frame if it doesn't exist
            if (!this.mediaFrame) {
                this.mediaFrame = wp.media({
                    title: rtiBadgeAdmin.i18n.selectImage,
                    button: {
                        text: rtiBadgeAdmin.i18n.useImage
                    },
                    multiple: false,
                    library: {
                        type: 'image'
                    }
                });

                // When an image is selected
                this.mediaFrame.on('select', function() {
                    var attachment = self.mediaFrame.state().get('selection').first().toJSON();
                    self.setBackgroundImage(attachment);
                });
            }

            this.mediaFrame.open();
        },

        /**
         * Set background image from media library selection
         *
         * @param {Object} attachment WordPress media attachment object
         */
        setBackgroundImage: function(attachment) {
            // Update hidden input
            $('#background_image_id').val(attachment.id);

            // Update preview
            var imageUrl = attachment.sizes && attachment.sizes.medium
                ? attachment.sizes.medium.url
                : attachment.url;

            $('#background-preview').html('<img src="' + imageUrl + '" alt="" />');

            // Show remove button
            $('#remove-background-btn').show();

            // Update badge preview
            this.updatePreview();
        },

        /**
         * Remove background image
         */
        removeBackgroundImage: function() {
            $('#background_image_id').val('0');
            $('#background-preview').html('<div class="rti-white-bg-placeholder">' + rtiBadgeAdmin.i18n.selectImage.replace('Select ', '') + '</div>');
            $('#remove-background-btn').hide();
            this.updatePreview();
        },

        /**
         * Update the live preview
         */
        updatePreview: function() {
            var self = this;
            var $preview = $('#badge-preview');

            // Clear existing preview
            $preview.empty();

            // Set background
            var backgroundId = $('#background_image_id').val();
            if (backgroundId && backgroundId !== '0') {
                var $bgImg = $('#background-preview img');
                if ($bgImg.length) {
                    $preview.css('background-image', 'url(' + $bgImg.attr('src') + ')');
                    $preview.addClass('has-background');
                }
            } else {
                $preview.css('background-image', 'none');
                $preview.removeClass('has-background');
            }

            // Render each field
            var fields = ['holder_name', 'rti_family', 'rti_club', 'qr_code', 'combination'];

            fields.forEach(function(fieldKey) {
                var $section = $('.rti-field-section[data-field="' + fieldKey + '"]');
                var isEnabled = $section.find('.rti-field-enabled').is(':checked');

                if (!isEnabled) {
                    return;
                }

                var x = parseFloat($section.find('input[name$="[x]"]').val()) || 0;
                var y = parseFloat($section.find('input[name$="[y]"]').val()) || 0;

                // Create preview element
                var $field = $('<div class="rti-preview-field"></div>');
                $field.attr('data-field', fieldKey);

                // Position (scaled)
                $field.css({
                    left: (x * self.previewScale) + 'px',
                    top: (y * self.previewScale) + 'px'
                });

                if (fieldKey === 'qr_code') {
                    // QR Code preview
                    var size = parseInt($section.find('input[name$="[size]"]').val()) || 35;
                    var scaledSize = size * self.previewScale;

                    $field.addClass('qr-code');
                    $field.css({
                        width: scaledSize + 'px',
                        height: scaledSize + 'px'
                    });
                    $field.text('QR');
                } else {
                    // Text field
                    var fontSize = parseInt($section.find('input[name$="[font_size]"]').val()) || 12;
                    var fontWeight = $section.find('select[name$="[font_weight]"]').val() || 'normal';
                    var alignment = $section.find('select[name$="[alignment]"]').val() || 'center';

                    $field.css({
                        fontSize: (fontSize * self.previewScale * 0.35) + 'px', // Scale down for preview
                        fontWeight: fontWeight
                    });

                    $field.addClass('align-' + alignment);
                    $field.text(self.sampleData[fieldKey] || fieldKey);
                }

                $preview.append($field);
            });
        },

        /**
         * Save settings via AJAX
         */
        saveSettings: function() {
            var self = this;
            var $button = $('#save-badge-template');
            var $status = $('#rti-save-status');

            // Disable button and show saving status
            $button.prop('disabled', true);
            $status.removeClass('success error').text(rtiBadgeAdmin.i18n.saving);

            // Serialize form data
            var formData = $('#rti-badge-template-form').serialize();

            $.ajax({
                url: rtiBadgeAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'rti_save_badge_template',
                    nonce: rtiBadgeAdmin.nonce,
                    settings: formData
                },
                success: function(response) {
                    if (response.success) {
                        $status.addClass('success').text(rtiBadgeAdmin.i18n.saved);
                    } else {
                        $status.addClass('error').text(response.data || rtiBadgeAdmin.i18n.error);
                    }
                },
                error: function() {
                    $status.addClass('error').text(rtiBadgeAdmin.i18n.error);
                },
                complete: function() {
                    $button.prop('disabled', false);

                    // Clear status after 3 seconds
                    setTimeout(function() {
                        $status.text('');
                    }, 3000);
                }
            });
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        BadgeAdmin.init();
    });

})(jQuery);
