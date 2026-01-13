
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProducerService, ProducerBatch, ProducerProfile } from '@/services/producerService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Clock, Factory, ShieldCheck, MapPin } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const PublicBatchPage = () => {
    const { trustCode } = useParams<{ trustCode: string }>();
    const [batch, setBatch] = useState<ProducerBatch | undefined>(undefined);
    const [producer, setProducer] = useState<ProducerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!trustCode) return;
            try {
                const batchData = await ProducerService.getBatchByTrustCode(trustCode);
                if (batchData) {
                    setBatch(batchData);
                    // In a real app we'd fetch the specific producer for this batch
                    // For mock, we just get the current demo producer
                    const prodData = await ProducerService.getProfile();
                    setProducer(prodData);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error(e);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [trustCode]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (error || !batch) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Invalid or Unknown Trust Code</h1>
            <p className="text-muted-foreground">The code you scanned could not be verified in our system.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Status Banner */}
            <div className={`p-6 text-center text-white ${batch.status === 'Safe' ? 'bg-green-600' :
                    batch.status === 'Recalled' ? 'bg-red-600' : 'bg-yellow-600'
                }`}>
                <div className="max-w-md mx-auto flex flex-col items-center gap-2">
                    {batch.status === 'Safe' && <CheckCircle className="w-12 h-12 mb-2" />}
                    {batch.status === 'Recalled' && <AlertTriangle className="w-12 h-12 mb-2" />}
                    {batch.status === 'Under Review' && <Clock className="w-12 h-12 mb-2" />}

                    <h1 className="text-3xl font-bold">{batch.status === 'Safe' ? 'Verified Safe' : batch.status === 'Recalled' ? 'Recall Alert' : 'Under Review'}</h1>
                    <p className="opacity-90">Batch: {batch.batchId}</p>

                    {batch.status === 'Recalled' && (
                        <div className="bg-white/10 p-4 rounded-lg mt-4 w-full text-left">
                            <p className="font-bold text-sm uppercase opacity-70 mb-1">Recall Reason:</p>
                            <p className="font-medium text-lg">{batch.recallReason}</p>
                            <p className="mt-2 text-sm">Do not consume this product. Return to point of purchase.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-md mx-auto -mt-6 px-4 space-y-6">
                {/* Product Card */}
                <Card className="shadow-lg border-t-0">
                    <CardContent className="p-6 text-center">
                        <h2 className="text-xl font-bold mb-1">{batch.productName}</h2>
                        <p className="text-muted-foreground text-sm mb-4">Trust Code: <span className="font-mono">{batch.trustCode}</span></p>

                        <div className="grid grid-cols-2 gap-4 text-sm text-left bg-muted/30 p-4 rounded-lg">
                            <div>
                                <p className="text-xs text-muted-foreground">Manufactured</p>
                                <p className="font-medium">{batch.mfgDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Best Before</p>
                                <p className="font-medium">{batch.expDate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Producer Identity */}
                {producer && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Factory className="w-5 h-5 text-primary" /> Producer Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold">{producer.businessName || 'Unknown Producer'}</h3>
                                    <p className="text-sm text-muted-foreground max-w-[200px]">{producer.address}</p>
                                </div>
                                {producer.verificationStatus === 'VERIFIED_DEMO' && (
                                    <Badge className="bg-blue-600 hover:bg-blue-700">Verified FBO</Badge>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t text-sm">
                                <div className="flex gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                                    <span>Lic. No: {producer.fssaiLicenseNo || 'Not Provided'}</span>
                                </div>
                                {producer.contactPhone && (
                                    <div className="flex gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span>Contact: {producer.contactPhone}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="text-center text-xs text-muted-foreground pb-8">
                    Verified by NutriSaath Trust Layer
                </div>
            </div>
        </div>
    );
};

export default PublicBatchPage;
