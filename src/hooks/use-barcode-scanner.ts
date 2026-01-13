import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface ScanResult {
  barcode: string | null;
  error?: string;
}

export const useBarcodeScanner = () => {
  const isNative = Capacitor.isNativePlatform();
  let reader: BrowserMultiFormatReader | null = null;
  let lastNotFoundLog = 0;
  let isScanning = false;

  const checkPermissions = async () => {
    console.log('🔍 [BARCODE SCANNER] Checking permissions...', { isNative });
    
    if (!isNative) {
      try {
        console.log('🔍 [BARCODE SCANNER] Requesting web camera permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('🔍 [BARCODE SCANNER] Web camera permission granted');
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        console.error('🔍 [BARCODE SCANNER] Web camera permission denied:', error);
        return false;
      }
    }

    console.log('🔍 [BARCODE SCANNER] Requesting native camera permission...');
    const status = await BarcodeScanner.checkPermission({ force: true });
    console.log('🔍 [BARCODE SCANNER] Native camera permission status:', status);
    return status.granted;
  };

  const startScan = async (): Promise<ScanResult> => {
    console.log('🔍 [BARCODE SCANNER] Starting scan...', { isNative, isScanning });
    
    if (isScanning) {
      console.log('🔍 [BARCODE SCANNER] ❌ Already scanning, ignoring request');
      return { barcode: null, error: 'Already scanning' };
    }
    
    isScanning = true;
    
    try {
      if (!isNative) {
        console.log('🔍 [BARCODE SCANNER] Using web barcode scanning (ZXing)');
        // Web barcode scanning using ZXing
        try {
          console.log('🔍 [BARCODE SCANNER] Requesting camera stream for web scanning...');
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1920, min: 1280 },
              height: { ideal: 1080, min: 720 },
              frameRate: { ideal: 60, min: 30 }, // Higher frame rate for faster scanning
              focusMode: 'continuous',
              whiteBalanceMode: 'continuous',
              exposureMode: 'continuous',
              // Additional optimizations for barcode scanning
              aspectRatio: { ideal: 16/9 },
              resizeMode: 'crop-and-scale'
            } 
          });
          console.log('🔍 [BARCODE SCANNER] Camera stream obtained successfully');
          
          const video = document.createElement('video');
          video.srcObject = stream;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.objectFit = 'cover';
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          // Optimize video for barcode scanning
          video.style.transform = 'scaleX(-1)'; // Mirror the video like camera apps
          video.style.filter = 'contrast(1.2) brightness(1.1)'; // Enhance contrast for better scanning
          
          // Wait for video to be ready before starting scan
          video.addEventListener('loadedmetadata', () => {
            console.log('🔍 [BARCODE SCANNER] Video metadata loaded, starting playback');
            console.log('🔍 [BARCODE SCANNER] Video stream settings:', {
              width: video.videoWidth,
              height: video.videoHeight,
              aspectRatio: video.videoWidth / video.videoHeight
            });
            video.play().catch(err => {
              console.error('🔍 [BARCODE SCANNER] Video play error:', err);
            });
          });
          
          // Add error handling for video
          video.addEventListener('error', (e) => {
            console.error('🔍 [BARCODE SCANNER] Video error:', e);
          });

          // Create simple scanner overlay like normal apps
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          overlay.style.zIndex = '9999';
          overlay.style.display = 'flex';
          overlay.style.alignItems = 'center';
          overlay.style.justifyContent = 'center';
          overlay.style.flexDirection = 'column';

          // Add video (full screen like normal apps)
          overlay.appendChild(video);
          
          // Enhanced scanning frame with animation
          const frame = document.createElement('div');
          frame.style.width = '280px';
          frame.style.height = '180px';
          frame.style.border = '3px solid #00ff00';
          frame.style.borderRadius = '12px';
          frame.style.position = 'absolute';
          frame.style.top = '50%';
          frame.style.left = '50%';
          frame.style.transform = 'translate(-50%, -50%)';
          frame.style.background = 'transparent';
          frame.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
          frame.style.zIndex = '2';
          frame.style.animation = 'pulse 2s infinite';
          
          // Add corner indicators for better targeting
          const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
          corners.forEach(corner => {
            const cornerEl = document.createElement('div');
            cornerEl.style.position = 'absolute';
            cornerEl.style.width = '20px';
            cornerEl.style.height = '20px';
            cornerEl.style.border = '3px solid #00ff00';
            cornerEl.style.backgroundColor = 'transparent';
            
            if (corner.includes('top')) cornerEl.style.top = '-3px';
            if (corner.includes('bottom')) cornerEl.style.bottom = '-3px';
            if (corner.includes('left')) cornerEl.style.left = '-3px';
            if (corner.includes('right')) cornerEl.style.right = '-3px';
            
            frame.appendChild(cornerEl);
          });
          
          overlay.appendChild(frame);
          
          // Add CSS animation for scanning effect
          const style = document.createElement('style');
          style.textContent = `
            @keyframes pulse {
              0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 0, 0.8); }
              50% { box-shadow: 0 0 50px rgba(0, 255, 0, 1); }
            }
          `;
          document.head.appendChild(style);

          // Simple instructions
          const instructions = document.createElement('div');
          instructions.style.color = 'white';
          instructions.style.textAlign = 'center';
          instructions.style.position = 'absolute';
          instructions.style.bottom = '100px';
          instructions.style.left = '50%';
          instructions.style.transform = 'translateX(-50%)';
          instructions.style.fontSize = '16px';
          instructions.style.fontWeight = 'bold';
          instructions.style.zIndex = '2';
          instructions.textContent = 'Point camera at barcode';
          overlay.appendChild(instructions);

          document.body.appendChild(overlay);
          console.log('🔍 [BARCODE SCANNER] Overlay added to DOM');

          // Initialize ZXing reader with better settings
          console.log('🔍 [BARCODE SCANNER] Initializing ZXing reader...');
          reader = new BrowserMultiFormatReader();
          
          // Configure reader for INSTANT detection like normal apps
          reader.timeBetweenDecodingAttempts = 0; // INSTANT scanning - no delay
          
          // Import hints from ZXing library for proper configuration
          const { DecodeHintType, BarcodeFormat } = await import('@zxing/library');
          
          // Comprehensive hints for maximum speed and accuracy
          const hints = new Map();
          hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.EAN_13,      // Most common for food products (13 digits)
            BarcodeFormat.EAN_8,       // Smaller food products (8 digits)
            BarcodeFormat.UPC_A,       // US/Canada food products (12 digits)
            BarcodeFormat.UPC_E,       // Compressed UPC (6 digits)
            BarcodeFormat.CODE_128,    // Common for many products
            BarcodeFormat.CODE_39,     // Common for many products
            BarcodeFormat.QR_CODE,     // QR codes
            BarcodeFormat.DATA_MATRIX, // Data matrix codes
            BarcodeFormat.AZTEC        // Aztec codes
          ]);
          hints.set(DecodeHintType.TRY_HARDER, false); // Disable for speed
          hints.set(DecodeHintType.CHARACTER_SET, 'UTF-8');
          hints.set(DecodeHintType.ASSUME_GS1, false); // Don't assume GS1 format
          
          // Apply hints to reader
          reader.hints = hints;
          
          console.log('🔍 [BARCODE SCANNER] ZXing reader initialized with optimized settings and hints');
          
          return new Promise((resolve) => {
            // Set a timeout to prevent infinite scanning (30 seconds)
            const scanTimeout = setTimeout(() => {
              console.log('🔍 [BARCODE SCANNER] ⏰ Scan timeout reached, stopping...');
              try {
                if (document.body.contains(overlay)) {
                  document.body.removeChild(overlay);
                }
                if (document.head.contains(style)) {
                  document.head.removeChild(style);
                }
              } catch (e) {
                console.log('🔍 [BARCODE SCANNER] DOM cleanup error (expected):', e.message);
              }
              stream.getTracks().forEach(track => track.stop());
              try {
                reader?.stopAsyncDecode();
              } catch (e) {
                console.log('🔍 [BARCODE SCANNER] Stop decode cleanup (expected):', e.message);
              }
              reader = null;
              isScanning = false;
              resolve({ barcode: null, error: 'Scan timeout - no barcode detected' });
            }, 30000); // 30 seconds timeout
            
            // Wait for video to be ready before starting decode
            const startDecoding = () => {
              console.log('🔍 [BARCODE SCANNER] Starting decode from video device...');
              console.log('🔍 [BARCODE SCANNER] Video dimensions:', {
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                readyState: video.readyState
              });
              
              reader!.decodeFromVideoDevice(undefined, video, (result, error) => {
                if (result) {
                  const barcodeText = result.getText();
                  const format = result.getBarcodeFormat();
                  
                  console.log('🔍 [BARCODE SCANNER] ✅ Barcode detected!', { 
                    barcode: barcodeText,
                    format: format,
                    formatName: format.toString(),
                    length: barcodeText.length,
                    resultPoints: result.getResultPoints()
                  });
                  
                  // Log additional info about barcode type
                  if (format.toString().includes('EAN_13')) {
                    console.log('🔍 [BARCODE SCANNER] 📱 EAN-13 detected (13 digits) - Common for food products');
                  } else if (format.toString().includes('EAN_8')) {
                    console.log('🔍 [BARCODE SCANNER] 📱 EAN-8 detected (8 digits) - Small food products');
                  } else if (format.toString().includes('UPC')) {
                    console.log('🔍 [BARCODE SCANNER] 📱 UPC detected - US/Canada food products');
                  } else {
                    console.log('🔍 [BARCODE SCANNER] 📱 Other format detected - May be non-food product');
                  }
                  
                  // Clear timeout since we found a barcode
                  clearTimeout(scanTimeout);
                  
                  // IMMEDIATELY stop the scanner to prevent infinite loop
                  try {
                    reader?.stopAsyncDecode();
                  } catch (e) {
                    console.log('🔍 [BARCODE SCANNER] Stop decode cleanup (expected):', e.message);
                  }
                  
                  // Clean up DOM
                  try {
                    if (document.body.contains(overlay)) {
                      document.body.removeChild(overlay);
                    }
                    if (document.head.contains(style)) {
                      document.head.removeChild(style);
                    }
                  } catch (e) {
                    console.log('🔍 [BARCODE SCANNER] DOM cleanup error (expected):', e.message);
                  }
                  
                  // Stop camera stream
                  stream.getTracks().forEach(track => track.stop());
                  reader = null;
                  isScanning = false;
                  
                  resolve({ barcode: result.getText() });
                  return;
                }
                if (error && error.name !== 'NotFoundException' && error.name !== 'NotFoundException2') {
                  // Only log significant errors, ignore common scanning errors
                  if (error.name === 'ChecksumException' || error.name === 'FormatException') {
                    // These are common and expected - barcode might be partially visible
                    // Don't log to avoid spam, just continue scanning
                  } else {
                    console.error('🔍 [BARCODE SCANNER] ❌ Barcode scan error:', {
                      name: error.name,
                      message: error.message
                    });
                  }
                } else if (error && (error.name === 'NotFoundException' || error.name === 'NotFoundException2')) {
                  // This is normal - no barcode found yet, keep scanning silently
                  // No logging to avoid spam like normal apps
                }
              });
            };

            // Start decoding when video is ready
            if (video.readyState >= 2) {
              startDecoding();
            } else {
              video.addEventListener('canplay', startDecoding, { once: true });
            }
            
            // Add simple close button
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '20px';
            closeBtn.style.right = '20px';
            closeBtn.style.width = '40px';
            closeBtn.style.height = '40px';
            closeBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '50%';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.zIndex = '3';
            closeBtn.style.fontSize = '20px';
            closeBtn.style.fontWeight = 'bold';
            closeBtn.onclick = () => {
              console.log('🔍 [BARCODE SCANNER] ❌ Scan cancelled by user');
              clearTimeout(scanTimeout);
              try {
                if (document.body.contains(overlay)) {
                  document.body.removeChild(overlay);
                }
                if (document.head.contains(style)) {
                  document.head.removeChild(style);
                }
              } catch (e) {
                console.log('🔍 [BARCODE SCANNER] DOM cleanup error (expected):', e.message);
              }
              stream.getTracks().forEach(track => track.stop());
              try {
                reader?.stopAsyncDecode();
              } catch (e) {
                console.log('🔍 [BARCODE SCANNER] Stop decode cleanup (expected):', e.message);
              }
              reader = null;
              isScanning = false;
              resolve({ barcode: null, error: 'Scan cancelled' });
            };
            overlay.appendChild(closeBtn);
          });
        } catch (error) {
          console.error('🔍 [BARCODE SCANNER] ❌ Web barcode scan error:', error);
          isScanning = false;
          return { barcode: null, error: 'Failed to access camera' };
        }
      }

      // Native barcode scanning
      console.log('🔍 [BARCODE SCANNER] Using native barcode scanning');
      const granted = await checkPermissions();
      if (!granted) {
        console.log('🔍 [BARCODE SCANNER] ❌ Camera permission denied for native scanning');
        isScanning = false;
        return { barcode: null, error: 'Camera permission denied' };
      }

      console.log('🔍 [BARCODE SCANNER] Starting native barcode scan...');
      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      
      const result = await BarcodeScanner.startScan();
      console.log('🔍 [BARCODE SCANNER] Native scan result:', result);
      
      document.querySelector('body')?.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();

      if (result.hasContent) {
        console.log('🔍 [BARCODE SCANNER] ✅ Native barcode detected!', { 
          barcode: result.content,
          format: result.format
        });
        isScanning = false;
        return { barcode: result.content };
      }

      console.log('🔍 [BARCODE SCANNER] ❌ No barcode found in native scan');
      isScanning = false;
      return { barcode: null, error: 'No barcode found' };
    } catch (error) {
      console.error('🔍 [BARCODE SCANNER] ❌ Scan error:', error);
      isScanning = false;
      return { barcode: null, error: 'Failed to scan barcode' };
    }
  };

  const stopScan = async () => {
    console.log('🔍 [BARCODE SCANNER] Stopping scan...', { isNative, hasReader: !!reader, isScanning });
    
    if (isNative) {
      console.log('🔍 [BARCODE SCANNER] Stopping native scan...');
      document.querySelector('body')?.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
      isScanning = false;
      console.log('🔍 [BARCODE SCANNER] Native scan stopped');
    } else if (reader) {
      console.log('🔍 [BARCODE SCANNER] Stopping web scan...');
      try {
        reader.stopAsyncDecode();
      } catch (e) {
        console.log('🔍 [BARCODE SCANNER] Stop decode cleanup (expected):', e.message);
      }
      reader = null;
      isScanning = false;
      console.log('🔍 [BARCODE SCANNER] Web scan stopped');
    }
  };

  return {
    startScan,
    stopScan,
    checkPermissions,
    isNative
  };
};