import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 

// importação das telas do app
import ApresentacaoScreen from './screens/ApresentacaoScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MenuScreen from './screens/MenuScreen';
import RelatorioScreen from './screens/RelatorioScreen';
import RecomendacoesScreen from './screens/RecomendacoesScreen';
import SereneMindScreen from './screens/SereneMindScreen';
import ProfileScreen from './screens/ProfileScreen';
import DiarioScreen from './screens/DiarioScreen';

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
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Relatorio" component={RelatorioScreen} />
          <Stack.Screen name="Recomendacao" component={RecomendacoesScreen} />
          <Stack.Screen name="SereneMind" component={SereneMindScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Diario" component={DiarioScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
         
