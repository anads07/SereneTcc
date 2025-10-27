import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 

// importação das telas do app
import ApresentacaoScreen from './screens/ApresentacaoScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import DiarioScreen from './screens/DiarioScreen';
import RegistrosScreen from './screens/RegistrosScreen';
import PerfilScreen from './screens/PerfilScreen';
import ChatScreen from './screens/ChatScreen';

// criação do stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    // view raiz para habilitar gestos
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator
          initialRouteName="Apresentacao"
          screenOptions={{ headerShown: false }} 
        >
          {/* definição das rotas do app */}
          <Stack.Screen name="Apresentacao" component={ApresentacaoScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="DiarioScreen" component={DiarioScreen} />
          <Stack.Screen name="RegistrosScreen" component={RegistrosScreen} />
          <Stack.Screen name="PerfilScreen" component={PerfilScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;