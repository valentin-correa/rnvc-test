import { NativeModules } from 'react-native';

const { FrameProcessorModule } = NativeModules;

export interface FrameResult {
  luminance: number;
  focus: number;
}

export function detectLuminanceAndFocus(frame: any): FrameResult {
  'worklet'
  // frame.data: ArrayBuffer o Uint8Array
  const result = FrameProcessorModule.processFrame(frame.data, frame.width, frame.height);
  return { luminance: result[0], focus: result[1] };
}
