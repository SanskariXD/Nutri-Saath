import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  Camera,
  Keyboard,
  Scan,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layout/AppLayout';
import { useBarcodeScanner } from '@/hooks/use-barcode-scanner';

const Scanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { startScan, stopScan, checkPermissions, isNative } = useBarcodeScanner();

  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Cleanup scanner when component unmounts
  useEffect(() => {
    return () => {
      console.log('📱 [SCANNER PAGE] Component unmounting, cleaning up scanner...');
      if (isScanning) {
        stopScan();
      }
    };
  }, [isScanning, stopScan]);

  const startScanning = async () => {
    console.log('📱 [SCANNER PAGE] Starting scanning process...', { isStarting, isScanning });

    if (isStarting || isScanning) {
      console.log('📱 [SCANNER PAGE] ❌ Already starting or scanning, ignoring request');
      return;
    }

    setError(null);
    setIsStarting(true);
    console.log('📱 [SCANNER PAGE] Set starting state to true');

    try {
      console.log('📱 [SCANNER PAGE] Checking permissions...');
      const granted = await checkPermissions();
      setHasPermission(granted);
      console.log('📱 [SCANNER PAGE] Permission check result:', granted);

      if (!granted) {
        console.log('📱 [SCANNER PAGE] ❌ Permission denied, setting error');
        setError('Camera permission denied or unavailable.');
        return;
      }

      console.log('📱 [SCANNER PAGE] Starting barcode scan...');
      setIsScanning(true);
      const result = await startScan();
      console.log('📱 [SCANNER PAGE] Scan result:', result);

      if (result.barcode) {
        console.log('📱 [SCANNER PAGE] ✅ Barcode detected, handling result:', result.barcode);
        handleBarcodeDetected(result.barcode);
      } else if (result.error) {
        console.log('📱 [SCANNER PAGE] ❌ Scan error:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('📱 [SCANNER PAGE] ❌ Barcode scanning failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to scan barcode';
      setError(message);
    } finally {
      console.log('📱 [SCANNER PAGE] Cleaning up scan state...');
      setIsScanning(false);
      setIsStarting(false);
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    console.log('📱 [SCANNER PAGE] ✅ Handling barcode detection:', barcode);
    setIsScanning(false);
    console.log('📱 [SCANNER PAGE] Navigating to product page:', `/consumer/product/${barcode}`);
    navigate(`/consumer/product/${barcode}`);
  };

  const handleManualSubmit = () => {
    const value = manualBarcode.trim();
    console.log('📱 [SCANNER PAGE] Manual barcode submission:', value);
    setError(null);

    if (!value) {
      console.log('📱 [SCANNER PAGE] ❌ Empty barcode entered');
      setError('Enter a barcode to search');
      return;
    }

    if (value.length < 8) {
      console.log('📱 [SCANNER PAGE] ❌ Barcode too short:', value.length);
      setError('Barcode must be at least 8 characters');
      return;
    }

    console.log('📱 [SCANNER PAGE] ✅ Valid manual barcode, navigating to:', `/consumer/product/${value}`);
    navigate(`/consumer/product/${value}`);
  };

  const stopScanning = async () => {
    console.log('📱 [SCANNER PAGE] Stopping scan...');
    setIsScanning(false);
    await stopScan();
    console.log('📱 [SCANNER PAGE] Scan stopped');
  };

  return (
    <AppLayout showBottomNav={false}>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </Button>

            <h1 className="text-lg font-semibold">{t('scan_product')}</h1>
          </div>
        </header>

        <div className="px-6 py-6">
          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!manualEntry ? (
            <div className="space-y-6">
              {/* Scanner Instructions */}
              <Card className="shadow-material-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="w-5 h-5" />
                    {t('scan_barcode')}
                  </CardTitle>
                  <CardDescription>
                    {t('scan_instructions')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                      <Camera className="w-16 h-16 text-primary" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{t('ready_to_scan')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isNative
                          ? t('tap_to_open_camera')
                          : t('tap_to_access_camera')
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={startScanning}
                      disabled={isStarting || isScanning}
                      className="w-full bg-gradient-primary text-white"
                      size="lg"
                    >
                      {isStarting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t('starting_camera')}
                        </>
                      ) : isScanning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t('scanning')}
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          {t('start_scanning')}
                        </>
                      )}
                    </Button>

                    {isScanning && (
                      <Button
                        onClick={stopScanning}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        {t('stop_scanning')}
                      </Button>
                    )}

                    <Button
                      onClick={() => setManualEntry(true)}
                      variant="ghost"
                      className="w-full"
                      size="lg"
                    >
                      <Keyboard className="w-4 h-4 mr-2" />
                      {t('enter_barcode_manually')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* How it works */}
              <Card className="shadow-material-md">
                <CardHeader>
                  <CardTitle>{t('how_it_works')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">{t('how_step1_title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('how_step1_desc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">{t('how_step2_title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('how_step2_desc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">{t('how_step3_title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('how_step3_desc')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-material-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  {t('enter_barcode_manually')}
                </CardTitle>
                <CardDescription>
                  {t('enter_barcode_tip')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="barcode" className="text-sm font-medium">
                    {t('barcode_number')}
                  </label>
                  <Input
                    id="barcode"
                    type="text"
                    placeholder={t('enter_barcode_placeholder')}
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    className="text-center text-lg tracking-wider"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleManualSubmit}
                    className="flex-1 bg-gradient-primary text-white"
                    disabled={!manualBarcode.trim()}
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    {t('search_product')}
                  </Button>

                  <Button
                    onClick={() => setManualEntry(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('use_camera')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Scanner;