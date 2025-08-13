import React, { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { runOnJS } from "react-native-reanimated";
import { Camera, PhotoFile, runAtTargetFps, useCameraDevice, useCameraPermission, useFrameProcessor  } from "react-native-vision-camera";

export default function MiCamera() {
    const camera = useRef<Camera>(null);
    const device = useCameraDevice("back");
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isActive, setIsActive] = useState(true);
    const [brightness, setBrightness] = useState(0);

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'

        if (!frame || !frame.isValid) return;

        runAtTargetFps(1, () => {

            const buffer = frame.toArrayBuffer()
            const data = new Uint8Array(buffer)

            console.log('pixel count', data.length);

            let luminanceSum = 0;

            const sampleSize = data.length

            for (let i = 0; i < sampleSize; i++) {
                luminanceSum += data[i]
            }

            const avgLuma = luminanceSum / sampleSize
            console.log(avgLuma)

            setBrightness(avgLuma)

        })
    }, [])

    // Solicitar permisos si no los tiene
    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>La cámara necesita permisos para funcionar</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Solicitar Permisos</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Si no hay dispositivo de cámara disponible
    if (device == null) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>No se encontró dispositivo de cámara</Text>
            </View>
        );
    }

    // Función para tomar foto
    const takePhoto = async () => {
        try {
            if (camera.current == null) throw new Error('Cámara no disponible');
            
            const photo: PhotoFile = await camera.current.takePhoto();
            console.log('Foto tomada:', photo.path);
            Alert.alert('Éxito', `Foto guardada en: ${photo.path}`);
        } catch (error) {
            console.error('Error al tomar foto:', error);
            Alert.alert('Error', 'No se pudo tomar la foto');
        }
    };

    return (
        <View style={styles.container}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                photo={true}
                frameProcessor={frameProcessor}
                pixelFormat="yuv"
            />
            <View style={{ position: 'absolute', top: 40, left: 12, zIndex: 10, backgroundColor: '#00000066', padding: 8, borderRadius: 6 }}>
                <Text style={{ color: 'white', fontSize: 14 }}>
                    El brillo promedio es {brightness}
                </Text>
            </View>

            
            {/* Controles de la cámara */}
            <View style={styles.controls}>
                <TouchableOpacity 
                    style={styles.captureButton} 
                    onPress={takePhoto}
                >
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>
            </View>
            
            {/* Botón para pausar/reanudar */}
            <View style={styles.topControls}>
                <TouchableOpacity 
                    style={styles.toggleButton} 
                    onPress={() => setIsActive(!isActive)}
                >
                    <Text style={styles.toggleButtonText}>
                        {isActive ? 'Pausar' : 'Reanudar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    message: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        margin: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    topControls: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    toggleButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    toggleButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    text: {
        color: "white",
        fontSize: 14    
    }
});