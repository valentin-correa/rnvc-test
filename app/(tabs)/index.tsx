import React, { useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";

export default function CameraComponent() {
  const [showCamera, setShowCamera] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const handleOpenCamera = async () => {
    if (!hasPermission) {
      await requestPermission();
    }
    setShowCamera(true);
  };

  if (showCamera) {
    if (!hasPermission) {
      return (
        <View style={styles.center}>
          <Text>Se necesita permiso para usar la cámara</Text>
          <Button title="Conceder permiso" onPress={requestPermission} />
        </View>
      );
    }
    if (!device) {
      return (
        <View style={styles.center}>
          <Text>No se encontró dispositivo de cámara</Text>
        </View>
      );
    }
    return (
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={true}
      />
    );
  }

  return (
    <View style={styles.center}>
      <Button title="Abrir cámara" onPress={handleOpenCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
  