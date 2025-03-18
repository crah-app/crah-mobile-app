declare module 'react-native-image-crop-picker' {
    export interface ImagePickerAsset {
        uri: string;
        width: number;
        height: number;
        mime: string;
        // Add other properties as needed
    }

    export function launchCameraAsync(options: any): Promise<{ canceled: boolean; assets?: ImagePickerAsset[] }>;
    export function launchImageLibraryAsync(options: any): Promise<{ canceled: boolean; assets?: ImagePickerAsset[] }>;
    export function openPicker(options: any): Promise<ImagePickerAsset>;
    export function openCamera(options: any): Promise<ImagePickerAsset>;
    export function clean(): void;
}