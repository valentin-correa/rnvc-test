import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const openCamera = () => {
    // Navegamos a la pestaña de la cámara usando su name
    router.push('./../MiCamera');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>¡Bienvenido a la aplicación!</Text>
      <Text style={styles.subtitle}>Esta es la pantalla principal</Text>
      <Button title="Abrir cámara" onPress={openCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});