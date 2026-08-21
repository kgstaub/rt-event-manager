jQuery(document).ready(function($) {

    var modal = $('#oauth-client-modal');
    var form = $('#oauth-client-form');

    // =====================================================
    // Inline Redirect URI Editing
    // =====================================================

    var originalRedirectUri = $('#redirect-uri-input').val();

    // Edit button click
    $('#edit-redirect-uri').on('click', function() {
        originalRedirectUri = $('#redirect-uri-text').text();
        $('#redirect-uri-input').val(originalRedirectUri);
        $('#redirect-uri-display').hide();
        $('#redirect-uri-edit').show();
        $('#redirect-uri-input').focus();
    });

    // Cancel button click
    $('#cancel-redirect-uri').on('click', function() {
        $('#redirect-uri-input').val(originalRedirectUri);
        $('#redirect-uri-edit').hide();
        $('#redirect-uri-display').show();
    });

    // Reset button click
    $('#reset-redirect-uri').on('click', function() {
        var defaultUri = $('#default-redirect-uri').val();
        $('#redirect-uri-input').val(defaultUri);
    });

    // Save button click
    $('#save-redirect-uri').on('click', function() {
        var newUri = $('#redirect-uri-input').val().trim();
        var $saveBtn = $(this);

        // If empty, use default
        if (!newUri) {
            newUri = $('#default-redirect-uri').val();
            $('#redirect-uri-input').val(newUri);
        }

        $saveBtn.prop('disabled', true);

        $.ajax({
            url: multiOAuthSSO.ajaxurl,
            type: 'POST',
            data: {
                action: 'save_redirect_uri',
                nonce: multiOAuthSSO.nonce,
                redirect_uri: newUri
            },
            success: function(response) {
                if (response.success) {
                    $('#redirect-uri-text').text(response.data.redirect_uri);
                    originalRedirectUri = response.data.redirect_uri;
                    $('#redirect-uri-edit').hide();
                    $('#redirect-uri-display').show();

                    // Brief success highlight
                    $('#redirect-uri-text').css('background-color', '#e7f5e7');
                    setTimeout(function() {
                        $('#redirect-uri-text').css('background-color', '');
                    }, 1000);
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            },
            complete: function() {
                $saveBtn.prop('disabled', false);
            }
        });
    });

    // Allow Enter key to save
    $('#redirect-uri-input').on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#save-redirect-uri').click();
        }
    });

    // Allow Escape key to cancel
    $('#redirect-uri-input').on('keyup', function(e) {
        if (e.which === 27) {
            $('#cancel-redirect-uri').click();
        }
    });

    // =====================================================
    // Drag and Drop for OAuth Profile Tags
    // =====================================================

    // Handle drag start on tags
    $(document).on('dragstart', '.oauth-tag', function(e) {
        $(this).addClass('dragging');
        e.originalEvent.dataTransfer.setData('text/plain', $(this).data('value'));
        e.originalEvent.dataTransfer.effectAllowed = 'copy';
    });

    $(document).on('dragend', '.oauth-tag', function(e) {
        $(this).removeClass('dragging');
    });

    // Handle drag over on input fields
    $(document).on('dragover', '.oauth-mapping-input', function(e) {
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'copy';
        $(this).addClass('drag-over');
    });

    $(document).on('dragleave', '.oauth-mapping-input', function(e) {
        $(this).removeClass('drag-over');
    });

    // Handle drop on input fields
    $(document).on('drop', '.oauth-mapping-input', function(e) {
        e.preventDefault();
        $(this).removeClass('drag-over');

        var value = e.originalEvent.dataTransfer.getData('text/plain');
        if (value) {
            // If input already has value, append with comma or replace
            var currentValue = $(this).val().trim();
            if (currentValue && !currentValue.includes(value)) {
                // Replace the value (most common use case for mapping)
                $(this).val(value);
            } else {
                $(this).val(value);
            }

            // Trigger change event
            $(this).trigger('change');

            // Visual feedback
            $(this).css('background-color', '#e7f5e7');
            setTimeout(function() {
                $(this).css('background-color', '');
            }.bind(this), 300);
        }
    });

    // Also allow clicking on tags to copy value to clipboard
    $(document).on('click', '.oauth-tag', function(e) {
        var value = $(this).data('value');

        // Try to copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(function() {
                // Show brief visual feedback
                var tag = $(e.target);
                var originalBg = tag.css('background-color');
                tag.css('background-color', '#00a32a');
                setTimeout(function() {
                    tag.css('background-color', '');
                }, 200);
            });
        }
    });

    // Initialize color pickers
    function initColorPickers() {
        $('.color-picker').each(function() {
            if (!$(this).hasClass('wp-color-picker')) {
                $(this).wpColorPicker({
                    change: updateButtonPreview,
                    clear: updateButtonPreview
                });
            }
        });
    }
    
    // Initial color picker setup
    initColorPickers();
    
    // Update preview when inputs change
    $('#button-text, #button-icon, #button-border-radius').on('input change', updateButtonPreview);
    
    // Function to update button preview
    function updateButtonPreview() {
        var preview = $('#button-preview');
        var previewText = $('#preview-text');
        
        // Get values
        var text = $('#button-text').val() || 'Login with OAuth';
        var icon = $('#button-icon').val();
        var bgColor = $('#button-bg-color').val() || '#0073aa';
        var textColor = $('#button-text-color').val() || '#ffffff';
        var borderColor = $('#button-border-color').val() || '#0073aa';
        var borderRadius = $('#button-border-radius').val() || '3px';
        var hoverBg = $('#button-hover-bg-color').val() || '#005a87';
        var hoverText = $('#button-hover-text-color').val() || '#ffffff';
        
        // Update text
        if (icon) {
            previewText.html('<img src="' + icon + '" alt="" style="height: 20px; vertical-align: middle; margin-right: 8px;">' + text);
        } else {
            previewText.text(text);
        }
        
        // Update styles
        preview.css({
            'background': bgColor,
            'color': textColor,
            'border-color': borderColor,
            'border-radius': borderRadius
        });
        
        // Store hover colors as data attributes
        preview.data('hover-bg', hoverBg);
        preview.data('hover-text', hoverText);
    }
    
    // Handle hover on preview button
    $(document).on('mouseenter', '#button-preview', function() {
        var hoverBg = $(this).data('hover-bg') || '#005a87';
        var hoverText = $(this).data('hover-text') || '#ffffff';
        $(this).css({
            'background': hoverBg,
            'color': hoverText
        });
    }).on('mouseleave', '#button-preview', function() {
        var bgColor = $('#button-bg-color').val() || '#0073aa';
        var textColor = $('#button-text-color').val() || '#ffffff';
        $(this).css({
            'background': bgColor,
            'color': textColor
        });
    });
    
    // Add new client button
    $('#add-new-client').on('click', function() {
        $('#modal-title').text('Add OAuth Client');
        form[0].reset();
        $('#client-id').val('');
        
        // Set default values for button styling
        $('#button-bg-color').val('#0073aa');
        $('#button-text-color').val('#ffffff');
        $('#button-border-color').val('#0073aa');
        $('#button-border-radius').val('3px');
        $('#button-hover-bg-color').val('#005a87');
        $('#button-hover-text-color').val('#ffffff');
        
        // Update color pickers with defaults
        setTimeout(function() {
            $('#button-bg-color').wpColorPicker('color', '#0073aa');
            $('#button-text-color').wpColorPicker('color', '#ffffff');
            $('#button-border-color').wpColorPicker('color', '#0073aa');
            $('#button-hover-bg-color').wpColorPicker('color', '#005a87');
            $('#button-hover-text-color').wpColorPicker('color', '#ffffff');
            
            updateButtonPreview();
        }, 100);
        
        modal.show();
    });
    
    // Edit client button
    $('.edit-client').on('click', function() {
        var clientId = $(this).data('id');
        loadClientData(clientId);
    });
    
    // Close modal
    $('.oauth-modal-close, #cancel-client-form').on('click', function() {
        modal.hide();
    });
    
    // Close modal when clicking outside
    $(window).on('click', function(event) {
        if (event.target == modal[0]) {
            modal.hide();
        }
    });
    
    // Submit form
    form.on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        var formData = $(this).serializeArray();
        
        // Ensure color picker values are included
        $('.color-picker').each(function() {
            var name = $(this).attr('name');
            var value = $(this).val();
            
            // Remove existing entry if present
            formData = formData.filter(function(item) {
                return item.name !== name;
            });
            
            // Add current value
            if (value) {
                formData.push({
                    name: name,
                    value: value
                });
            }
        });
        
        // Convert to URL encoded string
        var formString = $.param(formData);
        formString += '&action=save_oauth_client&nonce=' + multiOAuthSSO.nonce;
        
        // Debug: log what we're sending
        console.log('Submitting form data:', formData);
        
        $.ajax({
            url: multiOAuthSSO.ajaxurl,
            type: 'POST',
            data: formString,
            beforeSend: function() {
                form.find('button[type="submit"]').prop('disabled', true).text('Saving...');
            },
            success: function(response) {
                if (response.success) {
                    alert('Client saved successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            },
            complete: function() {
                form.find('button[type="submit"]').prop('disabled', false).text('Save Client');
            }
        });
    });
    
    // Duplicate client
    $(document).on('click', '.duplicate-client', function() {
        var clientId = $(this).data('id');
        
        if (!confirm('Duplicate this OAuth client? You will need to fill in the Provider Name, Client ID, and Client Secret.')) {
            return;
        }
        
        $.ajax({
            url: multiOAuthSSO.ajaxurl,
            type: 'POST',
            data: {
                action: 'duplicate_oauth_client',
                client_id: clientId,
                nonce: multiOAuthSSO.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Open modal with duplicated data
                    $('#modal-title').text('Add OAuth Client (Duplicated)');
                    $('#client-id').val(''); // New client, no ID
                    
                    var data = response.data;
                    
                    // Set form values from duplicated client
                    $('#client-name').val(data.name); // Empty
                    $('#display-order').val(data.display_order);
                    $('#oauth-client-id').val(data.client_id); // Empty
                    $('#client-secret').val(data.client_secret); // Empty
                    $('#authorization-endpoint').val(data.authorization_endpoint);
                    $('#token-endpoint').val(data.token_endpoint);
                    $('#userinfo-endpoint').val(data.userinfo_endpoint);
                    $('#scope').val(data.scope);
                    $('#redirect-uri').val(data.redirect_uri);
                    $('#button-text').val(data.button_text);
                    $('#button-icon').val(data.button_icon);
                    
                    // Load button styling
                    setTimeout(function() {
                        $('#button-bg-color').val(data.button_bg_color).wpColorPicker('color', data.button_bg_color);
                        $('#button-text-color').val(data.button_text_color).wpColorPicker('color', data.button_text_color);
                        $('#button-border-color').val(data.button_border_color).wpColorPicker('color', data.button_border_color);
                        $('#button-border-radius').val(data.button_border_radius);
                        $('#button-hover-bg-color').val(data.button_hover_bg_color).wpColorPicker('color', data.button_hover_bg_color);
                        $('#button-hover-text-color').val(data.button_hover_text_color).wpColorPicker('color', data.button_hover_text_color);
                        
                        updateButtonPreview();
                    }, 100);
                    
                    // Load attribute mapping
                    if (data.attribute_mapping) {
                        var mapping = JSON.parse(data.attribute_mapping);
                        for (var key in mapping) {
                            $('#map-' + key).val(mapping[key]);
                        }
                    }
                    
                    modal.show();
                    
                    // Alert user to fill in required fields
                    alert('Please fill in:\n• Provider Name\n• Client ID\n• Client Secret\n\nAll other settings have been copied from the original client.');
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    });
    
    // Toggle client
    $('.toggle-client').on('click', function() {
        var button = $(this);
        var clientId = button.data('id');
        var enabled = button.data('enabled');
        
        if (!confirm('Are you sure you want to ' + (enabled ? 'disable' : 'enable') + ' this client?')) {
            return;
        }
        
        $.ajax({
            url: multiOAuthSSO.ajaxurl,
            type: 'POST',
            data: {
                action: 'toggle_oauth_client',
                nonce: multiOAuthSSO.nonce,
                client_id: clientId,
                enabled: enabled
            },
            success: function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    });
    
    // Delete client
    $('.delete-client').on('click', function() {
        var clientId = $(this).data('id');
        
        if (!confirm('Are you sure you want to delete this OAuth client? This action cannot be undone.')) {
            return;
        }
        
        $.ajax({
            url: multiOAuthSSO.ajaxurl,
            type: 'POST',
            data: {
                action: 'delete_oauth_client',
                nonce: multiOAuthSSO.nonce,
                client_id: clientId
            },
            success: function(response) {
                if (response.success) {
                    alert('Client deleted successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    });
    
    // =====================================================
    // Local Registration Toggle
    // =====================================================

    $('#world-sso-local-registration').on('change', function() {
        var $checkbox = $(this);
        var enabled = $checkbox.is(':checked') ? '1' : '0';

        $checkbox.prop('disabled', true);

        $.ajax({
            url: multiOAuthSSO.ajaxurl,
            type: 'POST',
            data: {
                action: 'save_local_registration',
                nonce: multiOAuthSSO.nonce,
                enabled: enabled
            },
            success: function(response) {
                if (!response.success) {
                    // Revert the checkbox
                    $checkbox.prop('checked', !$checkbox.is(':checked'));
                    alert('Error: ' + response.data);
                }
            },
            error: function() {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                alert('An error occurred. Please try again.');
            },
            complete: function() {
                $checkbox.prop('disabled', false);
            }
        });
    });

    // Load client data for editing
    function loadClientData(clientId) {
        $.ajax({
            url: multiOAuthSSO.ajaxurl,
            type: 'POST',
            data: {
                action: 'get_oauth_client',
                nonce: multiOAuthSSO.nonce,
                client_id: clientId
            },
            success: function(response) {
                if (response.success) {
                    var client = response.data;
                    $('#modal-title').text('Edit OAuth Client');
                    $('#client-id').val(client.id);
                    $('#client-name').val(client.name);
                    $('#display-order').val(client.display_order || 0);
                    $('#oauth-client-id').val(client.client_id);
                    $('#client-secret').val(client.client_secret);
                    $('#authorization-endpoint').val(client.authorization_endpoint);
                    $('#token-endpoint').val(client.token_endpoint);
                    $('#userinfo-endpoint').val(client.userinfo_endpoint);
                    $('#scope').val(client.scope);
                    $('#redirect-uri').val(client.redirect_uri);
                    $('#button-text').val(client.button_text);
                    $('#button-icon').val(client.button_icon);
                    
                    // Load button styling with proper defaults and set color pickers
                    setTimeout(function() {
                        var bgColor = client.button_bg_color || '#0073aa';
                        var textColor = client.button_text_color || '#ffffff';
                        var borderColor = client.button_border_color || '#0073aa';
                        var borderRadius = client.button_border_radius || '3px';
                        var hoverBg = client.button_hover_bg_color || '#005a87';
                        var hoverText = client.button_hover_text_color || '#ffffff';
                        
                        $('#button-bg-color').val(bgColor).wpColorPicker('color', bgColor);
                        $('#button-text-color').val(textColor).wpColorPicker('color', textColor);
                        $('#button-border-color').val(borderColor).wpColorPicker('color', borderColor);
                        $('#button-border-radius').val(borderRadius);
                        $('#button-hover-bg-color').val(hoverBg).wpColorPicker('color', hoverBg);
                        $('#button-hover-text-color').val(hoverText).wpColorPicker('color', hoverText);
                        
                        updateButtonPreview();
                    }, 100);
                    
                    // Clear all mapping inputs first
                    $('.oauth-mapping-input').val('');

                    // Load attribute mapping
                    if (client.attribute_mapping) {
                        var mapping = JSON.parse(client.attribute_mapping);
                        for (var key in mapping) {
                            $('#map-' + key).val(mapping[key]);
                        }
                    }

                    updateButtonPreview();
                    modal.show();
                } else {
                    alert('Error loading client data');
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            }
        });
    }
});
