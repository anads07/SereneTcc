import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function PlaceholderScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#C8A2C8', '#9370DB']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={80} color="#fff" />
        <Text style={styles.title}>Tela em Construção</Text>
        <Text style={styles.subtitle}>
          Esta funcionalidade estará disponível em breve.
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 25,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#9370DB',
    fontWeight: '600',
    fontSize: 16,
  },
});
