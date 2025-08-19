#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

extern "C" void processFrame(const uint8_t* rgbaData, int width, int height, float* outResult) {
    long lumSum = 0;
    int totalPixels = width * height;
    std::vector<float> luminances(totalPixels);

    for(int i=0, j=0; i<totalPixels*4; i+=4, j++){
        uint8_t r = rgbaData[i];
        uint8_t g = rgbaData[i+1];
        uint8_t b = rgbaData[i+2];
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

    outResult[0] = lumSum/float(totalPixels);
    outResult[1] = focusVar;
}
