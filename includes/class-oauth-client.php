<?php
/**
 * OAuth Client Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class Multi_OAuth_SSO_Client {
    
    private $client;
    
    public function __construct($client) {
        $this->client = $client;
    }
    
    /**
     * Exchange authorization code for access token
     */
    public function exchange_code_for_token($code) {
        $token_params = array(
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->client->redirect_uri,
            'client_id' => $this->client->client_id,
            'client_secret' => $this->client->client_secret
        );
        
        $response = wp_remote_post($this->client->token_endpoint, array(
            'body' => $token_params,
            'headers' => array(
                'Content-Type' => 'application/x-www-form-urlencoded'
            ),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            throw new Exception('Failed to exchange code for token: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!isset($data['access_token'])) {
            throw new Exception('Access token not found in response');
        }
        
        return $data;
    }
    
    /**
     * Get user information from OAuth provider
     */
    public function get_user_info($access_token) {
        $response = wp_remote_get($this->client->userinfo_endpoint, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $access_token,
                'Accept' => 'application/json'
            ),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            throw new Exception('Failed to get user info: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $user_info = json_decode($body, true);
        
        if (empty($user_info)) {
            throw new Exception('Empty user info response');
        }
        
        return $user_info;
    }
    
    /**
     * Refresh access token
     */
    public function refresh_token($refresh_token) {
        $token_params = array(
            'grant_type' => 'refresh_token',
            'refresh_token' => $refresh_token,
            'client_id' => $this->client->client_id,
            'client_secret' => $this->client->client_secret
        );
        
        $response = wp_remote_post($this->client->token_endpoint, array(
            'body' => $token_params,
            'headers' => array(
                'Content-Type' => 'application/x-www-form-urlencoded'
            ),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            throw new Exception('Failed to refresh token: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        return $data;
    }
}
