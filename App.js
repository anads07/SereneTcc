import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, StatusBar } from 'react-native';

// Importe suas telas
import ApresentacaoScreen from './screens/ApresentacaoScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MenuScreen from './screens/MenuScreen';
import RelatorioScreen from './screens/RelatorioScreen';
import RecomendacoesScreen from './screens/RecomendacoesScreen';
import ChatBotScreen from './screens/ChatBotScreen';
import ProfileScreen from './screens/ProfileScreen';
import DiarioScreen from './screens/DiarioScreen';
const Stack = createStackNavigator();

// ✅ Correto
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        initialRouteName="Apresentacao"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Apresentacao" component={ApresentacaoScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Relatorio" component={RelatorioScreen} />
        <Stack.Screen name="Recomendacao" component={RecomendacoesScreen} />
        <Stack.Screen name="Chat" component={ChatBotScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Diario" component={DiarioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;