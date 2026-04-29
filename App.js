import React from 'react';
import { TextInput } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  placeholderTextColor: '#6c757d',
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
