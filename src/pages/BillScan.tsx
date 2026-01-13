import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  ArrowLeft,
  AlertCircle,
  Receipt,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ensureCamera, stopCamera, requestCameraPermission } from '@/utils/cameraUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { billService } from '@/services/billService';
import AppLayout from '@/components/layout/AppLayout';

const BillScan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearScanTimeout = () => {
    if (scanTimeoutRef.current !== null) {
      window.clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
  };

  const stopScanning = () => {
    clearScanTimeout();
    setIsScanning(false);
    setTorchEnabled(false);
    stopCamera(videoRef, streamRef);
  };

  const startScanning = async () => {
    console.log('🧾 [BILL SCAN PAGE] Starting bill scanning...', { isStarting });

    if (isStarting) return;

    setError(null);
    setIsStarting(true);
    clearScanTimeout();
    console.log('🧾 [BILL SCAN PAGE] Set starting state to true');

    let permissionGranted = false;

    try {
      console.log('🧾 [BILL SCAN PAGE] Requesting camera permission...');
      const granted = await requestCameraPermission();
      permissionGranted = granted;
      setHasPermission(granted);
      console.log('🧾 [BILL SCAN PAGE] Camera permission result:', granted);

      if (!granted) {
        console.log('🧾 [BILL SCAN PAGE] ❌ Camera permission denied');
        setError('Camera permission denied or unavailable.');
        stopScanning();
        return;
      }

      console.log('🧾 [BILL SCAN PAGE] Ensuring camera access...');
      await ensureCamera(videoRef, streamRef, { facingMode: 'environment' });
      setTorchEnabled(false);
      setIsScanning(true);
      console.log('🧾 [BILL SCAN PAGE] ✅ Camera initialized, ready for scanning');

      // Real scanning - capture image when user taps
      // No automatic timeout for demo
    } catch (err) {
      console.error('🧾 [BILL SCAN PAGE] ❌ Camera initialization failed:', err);
      const message =
        err instanceof Error ? err.message : 'Unable to access the camera.';
      setError(message);

      if (
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'SecurityError')
      ) {
        console.log('🧾 [BILL SCAN PAGE] ❌ Permission error detected');
        setHasPermission(false);
      } else if (!permissionGranted) {
        console.log('🧾 [BILL SCAN PAGE] ❌ Permission not granted');
        setHasPermission(false);
      }

      stopScanning();
    } finally {
      console.log('🧾 [BILL SCAN PAGE] Cleaning up starting state...');
      setIsStarting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current !== null) {
        window.clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
      stopCamera(videoRef, streamRef);
    };
  }, []);

  const captureImage = async () => {
    console.log('🧾 [BILL SCAN PAGE] Capturing image...');

    if (!videoRef.current) {
      console.log('🧾 [BILL SCAN PAGE] ❌ Camera not ready');
      setError('Camera not ready');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log('🧾 [BILL SCAN PAGE] Canvas created:', {
        width: canvas.width,
        height: canvas.height
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.log('🧾 [BILL SCAN PAGE] ❌ Failed to get canvas context');
        setError('Failed to capture image');
        return;
      }

      ctx.drawImage(video, 0, 0);
      console.log('🧾 [BILL SCAN PAGE] Image drawn to canvas');

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.log('🧾 [BILL SCAN PAGE] ❌ Failed to create blob from canvas');
          setError('Failed to capture image');
          return;
        }

        console.log('🧾 [BILL SCAN PAGE] ✅ Image captured successfully:', {
          blobSize: blob.size,
          blobType: blob.type
        });

        const file = new File([blob], 'bill.jpg', { type: 'image/jpeg' });
        await handleBillDetected(file);
      }, 'image/jpeg', 0.8);
    } catch (err) {
      console.error('🧾 [BILL SCAN PAGE] ❌ Image capture failed:', err);
      setError('Failed to capture image');
    }
  };

  const handleBillDetected = async (imageFile: File) => {
    console.log('🧾 [BILL SCAN PAGE] Handling bill detection...', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    stopScanning();

    try {
      setIsScanning(true);
      setError(null);
      console.log('🧾 [BILL SCAN PAGE] Starting bill parsing...');

      const result = await billService.parseBill(imageFile);
      console.log('🧾 [BILL SCAN PAGE] ✅ Bill parsed successfully:', result);

      const billData = {
        merchant: result.bill.merchant,
        date: result.bill.date,
        items: result.bill.items,
        subtotal: result.bill.subtotal,
        tax: result.bill.tax,
        total: result.bill.total,
        rawText: result.bill.rawText,
        receiptId: result.receiptId
      };

      console.log('🧾 [BILL SCAN PAGE] Navigating to bill summary with data:', billData);
      navigate('/consumer/bill-summary', { state: { billData } });
    } catch (err) {
      console.error('🧾 [BILL SCAN PAGE] ❌ Bill parsing failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse bill');
    } finally {
      console.log('🧾 [BILL SCAN PAGE] Cleaning up scanning state...');
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('🧾 [BILL SCAN PAGE] File upload triggered:', file);
    if (file) {
      console.log('🧾 [BILL SCAN PAGE] Processing uploaded file...');
      handleBillDetected(file);
    }
  };

  const toggleTorch = async () => {
    try {
      if (!videoRef.current?.srcObject) return;

      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];

      if (videoTrack && 'torch' in videoTrack.getCapabilities()) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !torchEnabled } as any]
        });
        setTorchEnabled(!torchEnabled);
      }
    } catch (err) {
      console.error('Torch toggle failed:', err);
    }
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between p-6 pt-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('back')}
            </Button>

            <h1 className="text-lg font-semibold text-white">
              {t('scan_bill')}
            </h1>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTorch}
              className="text-white hover:bg-white/20"
              disabled={!isScanning}
            >
              {torchEnabled ? (
                <FlashlightOff className="w-5 h-5" />
              ) : (
                <Flashlight className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Camera View */}
        <div className="absolute inset-0 flex items-center justify-center">
          {hasPermission === null ? (
            <Card className="mx-6 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  {t('camera_access_required')}
                </CardTitle>
                <CardDescription>
                  {t('allow_camera_bill')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={startScanning}
                  className="w-full"
                  disabled={isStarting}
                >
                  {t('allow_camera_access')}
                </Button>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground px-2">{t('or')}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('upload_bill_image')}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : hasPermission === false ? (
            <Card className="mx-6 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <CameraOff className="w-5 h-5" />
                  {t('camera_permission_denied')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('bill_permission_tip')}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('upload_bill_image')}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Bill Frame */}
                  <div className="w-80 h-64 border-2 border-white rounded-2xl relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-xl" />

                    {/* Google Lens style scanning dots */}
                    {isScanning && (
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 bg-primary rounded-full animate-pulse"
                            style={{
                              left: `${15 + (i % 3) * 35}%`,
                              top: `${20 + Math.floor(i / 3) * 60}%`,
                              animationDelay: `${i * 200}ms`,
                              animationDuration: '1.5s'
                            }}
                          />
                        ))}
                        <div className="absolute inset-x-4 top-1/2 h-0.5 bg-primary/50 animate-pulse" />
                      </div>
                    )}

                    {/* Receipt icon */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Receipt className="w-12 h-12 text-white/50" />
                    </div>
                  </div>

                  <p className="text-white text-center mt-4 text-sm">
                    {t('bill_frame_tip')}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute bottom-20 left-6 right-6 z-20">
            <Alert className="bg-destructive/90 border-destructive text-destructive-foreground backdrop-blur">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Bottom Controls */}
        {hasPermission === true && (
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="flex justify-center gap-4">
              {!isScanning ? (
                <Button
                  onClick={startScanning}
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground"
                  disabled={isStarting}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {t('start_camera')}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={captureImage}
                    size="lg"
                    className="bg-primary hover:bg-primary-dark text-primary-foreground"
                    disabled={isScanning}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {t('capture_bill')}
                  </Button>

                  <Button
                    onClick={stopScanning}
                    size="lg"
                    variant="secondary"
                  >
                    {t('cancel')}
                  </Button>
                </>
              )}

              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Upload className="w-5 h-5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BillScan;
