package com.example.service;

import com.example.model.JwtRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private JwtRequest jwtRequest;

    public CustomUserDetails(JwtRequest jwtRequest) {
        this.jwtRequest = jwtRequest;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Implement this method based on your requirements
        // Return the authorities/roles for the user
        return null;
    }

    @Override
    public String getPassword() {
        return jwtRequest.getPassword();
    }

    @Override
    public String getUsername() {
        return jwtRequest.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        // Implement this method based on your requirements
        // Return true if the user account is not expired
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Implement this method based on your requirements
        // Return true if the user account is not locked
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Implement this method based on your requirements
        // Return true if the user credentials are not expired
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Implement this method based on your requirements
        // Return true if the user account is enabled
        return true;
    }
}
