#include <jni.h>
#include <vector>
#include <cmath>
#include "frameprocessors/FrameHostObject.h"

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_com_myplugin_FrameProcessor_processFrame(JNIEnv *env, jclass, jbyteArray frameData, jint width, jint height) {
    jbyte* data = env->GetByteArrayElements(frameData, 0);
    int totalPixels = width * height;
    
    long lumSum = 0;
    std::vector<float> luminances(totalPixels);

    for(int i = 0, j=0; i<totalPixels*4; i+=4, j++){
        uint8_t r = (uint8_t)data[i];
        uint8_t g = (uint8_t)data[i+1];
        uint8_t b = (uint8_t)data[i+2];
        float lum = 0.299*r + 0.587*g + 0.114*b;
        luminances[j] = lum;
        lumSum += lum;
    }

    float mean = lumSum / float(totalPixels);

    float focusVar = 0;
    for(int i=0; i<totalPixels; i++){
        float diff = luminances[i] - mean;
        focusVar += diff*diff;
    }
    focusVar /= totalPixels;

    jfloat result[2] = {lumSum/float(totalPixels), focusVar};

    jfloatArray outArray = env->NewFloatArray(2);
    env->SetFloatArrayRegion(outArray, 0, 2, result);

    env->ReleaseByteArrayElements(frameData, data, 0);
    return outArray;
}
