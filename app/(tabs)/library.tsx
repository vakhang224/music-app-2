import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import { authorize, refresh, AuthConfiguration } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Spotify configuration for OAuth
const spotifyAuthConfig: AuthConfiguration = {
  clientId: 'b42cc2747e39432084ae1aee8268d3e9', // Replace with your Spotify Client ID
  clientSecret: '65236f599c06485185deb28fe3c58c2c', // Client secret is optional here (better to handle on backend)
  redirectUrl: 'exp://localhost:8081/--/spotify-auth-callback', // Your registered redirect URI
  scopes: ['user-read-email', 'playlist-read-private', 'user-library-read'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};

// Storage key for AsyncStorage
const AUTH_STORAGE_KEY = 'SPOTIFY_AUTH_STATE';

interface AuthState {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationDate: string;
}

const SpotifyAuth = () => {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved auth state from storage on component mount
  useEffect(() => {
    loadAuthState();
    
    // Set up deep linking listener
    const handleDeepLink = (event: { url: string }) => {
      handleIncomingRedirect(event.url);
    };

    // Register the event listener for deep links
    Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleIncomingRedirect(url);
      }
    });

    // Set up token refresh interval
    const tokenRefreshInterval = setInterval(() => {
      checkAndRefreshToken();
    }, 60000); // Check every minute

    // Clean up
    return () => {
      // Linking.removeEventListener('url', handleDeepLink); // For newer React Native versions
      clearInterval(tokenRefreshInterval);
    };
  }, [authState]);

  // Handle incoming deep link from OAuth redirect
  const handleIncomingRedirect = (url: string) => {
    // In a real app, you might need to parse the URL for auth tokens
    // if using implicit flow. With react-native-app-auth this is typically handled
    // automatically by the library.
    console.log('Received deep link:', url);
  };

  // Load auth state from AsyncStorage
  const loadAuthState = async () => {
    try {
      const storedAuthState = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuthState) {
        const parsedAuthState = JSON.parse(storedAuthState);
        setAuthState(parsedAuthState);
        console.log('Loaded auth state from storage');
      }
    } catch (err) {
      console.error('Failed to load auth state:', err);
    }
  };

  // Save auth state to AsyncStorage
  const saveAuthState = async (state: AuthState) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
      console.log('Auth state saved to storage');
    } catch (err) {
      console.error('Failed to save auth state:', err);
    }
  };

  // Check if token is expired and refresh if needed
  const checkAndRefreshToken = async () => {
    if (!authState) return;
    
    const expirationDate = new Date(authState.accessTokenExpirationDate);
    const now = new Date();
    
    // If token expires in less than 5 minutes, refresh it
    const fiveMinutesInMs = 5 * 60 * 1000;
    if (expirationDate.getTime() - now.getTime() < fiveMinutesInMs) {
      console.log('Token expiring soon, refreshing...');
      await handleRefresh();
    }
  };

  // Handle authentication with Spotify
  const handleAuth = async () => {
    try {
      const result = await authorize(spotifyAuthConfig);
      
      // Save auth result
      const authState = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpirationDate: result.accessTokenExpirationDate,
      };
      
      setAuthState(authState);
      await saveAuthState(authState);
      
      console.log('Authentication successful');
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
    }
  };

  // Refresh token when expired
  const handleRefresh = async () => {
    try {
      if (!authState?.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const result = await refresh(spotifyAuthConfig, {
        refreshToken: authState.refreshToken,
      });
      
      // Update auth state with new tokens
      const updatedAuthState = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken || authState.refreshToken,
        accessTokenExpirationDate: result.accessTokenExpirationDate,
      };
      
      setAuthState(updatedAuthState);
      await saveAuthState(updatedAuthState);
      
      console.log('Token refresh successful');
    } catch (err) {
      setError('Token refresh failed');
      console.error(err);
      
      // If refresh fails, we might need to re-authenticate
      setAuthState(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // Example of making an API call with the token
  const makeApiCall = async () => {
    if (!authState?.accessToken) {
      setError('No access token available');
      return;
    }
    
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${authState.accessToken}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token likely expired, try to refresh
          await handleRefresh();
          // Retry the API call with new token
          return makeApiCall();
        }
        throw new Error(`API call failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API call successful:', data);
    } catch (err) {
      setError('API call failed');
      console.error(err);
    }
  };

  // Logout function
  const handleLogout = async () => {
    setAuthState(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    console.log('Logged out');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotify Authentication</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      {!authState?.accessToken ? (
        <Button title="Login with Spotify" onPress={handleAuth} />
      ) : (
        <View>
          <Text style={styles.success}>Authenticated with Spotify!</Text>
          <Text>Access Token: {authState.accessToken.substring(0, 20)}...</Text>
          <Text>Expires: {new Date(authState.accessTokenExpirationDate).toLocaleString()}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Refresh Token" onPress={handleRefresh} />
            <Button title="Make API Call" onPress={makeApiCall} />
            <Button title="Logout" onPress={handleLogout} color="red" />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
});

export default SpotifyAuth;