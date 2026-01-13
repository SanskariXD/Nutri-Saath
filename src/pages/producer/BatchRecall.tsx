
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProducerService, ProducerBatch } from '@/services/producerService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BatchRecall = () => {
    const { toast } = useToast();
    const [batches, setBatches] = useState<ProducerBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBatch, setSelectedBatch] = useState<ProducerBatch | null>(null);

    // Recall Modal State
    const [recallReason, setRecallReason] = useState('');
    const [recallOpen, setRecallOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const loadBatches = async () => {
        setLoading(true);
        try {
            const data = await ProducerService.getBatches();
            setBatches(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBatches();
    }, []);

    const handleStatusChange = async (batchId: string, status: 'Safe' | 'Recalled' | 'Under Review', reason?: string) => {
        setProcessing(true);
        try {
            await ProducerService.updateBatchStatus(batchId, status, reason);
            toast({
                title: "Status Updated",
                description: `Batch ${status === 'Recalled' ? 'marked as Recalled' : 'status updated'}.`
            });
            setRecallOpen(false);
            loadBatches();
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(false);
        }
    }

    const initiateRecall = () => {
        if (!selectedBatch) return;
        handleStatusChange(selectedBatch.id, 'Recalled', recallReason);
    }

    const resolveRecall = (batch: ProducerBatch) => {
        handleStatusChange(batch.id, 'Safe');
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Safe':
                return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Safe</Badge>;
            case 'Recalled':
                return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" /> Recalled</Badge>;
            default:
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Under Review</Badge>;
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Batch & Recall Management</h1>
                    <p className="text-muted-foreground">Monitor safety compliance and initiate recalls if needed.</p>
                </div>
                <Button variant="outline" onClick={loadBatches} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            <Dialog open={recallOpen} onOpenChange={setRecallOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Initiate Product Recall
                        </DialogTitle>
                        <DialogDescription>
                            This will mark the batch as unsafe immediately. All consumers scanning this batch will see a red warning.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Batch ID</Label>
                            <Input value={selectedBatch?.batchId} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Recall</Label>
                            <Input
                                placeholder="e.g. Contamination detected, mislabeling..."
                                value={recallReason}
                                onChange={(e) => setRecallReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRecallOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={initiateRecall} disabled={!recallReason || processing}>
                            {processing ? "Processing..." : "Confirm Recall"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Batches</CardTitle>
                    <CardDescription>Actions taken here propagate to the public verification page instantly.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && batches.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">Loading batches...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch / Lot</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Trust Code</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {batches.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No batches found. Create one in 'Trust Code QR'.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    batches.map((batch) => (
                                        <TableRow key={batch.id}>
                                            <TableCell className="font-medium">{batch.batchId}</TableCell>
                                            <TableCell>{batch.productName}</TableCell>
                                            <TableCell className="text-xs">
                                                <div className="text-muted-foreground">Mfg: {batch.mfgDate}</div>
                                                <div>Exp: {batch.expDate}</div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{batch.trustCode}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 items-start">
                                                    {getStatusBadge(batch.status)}
                                                    {batch.recallReason && <span className="text-xs text-red-600 max-w-[150px] truncate" title={batch.recallReason}>{batch.recallReason}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {batch.status === 'Safe' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(batch.id, 'Under Review')}>Review</Button>
                                                        <Button size="sm" variant="destructive" onClick={() => {
                                                            setSelectedBatch(batch);
                                                            setRecallReason('');
                                                            setRecallOpen(true);
                                                        }}>Recall</Button>
                                                    </div>
                                                )}
                                                {batch.status === 'Under Review' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusChange(batch.id, 'Safe')}>Mark Safe</Button>
                                                        <Button size="sm" variant="destructive" onClick={() => {
                                                            setSelectedBatch(batch);
                                                            setRecallReason('');
                                                            setRecallOpen(true);
                                                        }}>Recall</Button>
                                                    </div>
                                                )}
                                                {batch.status === 'Recalled' && (
                                                    <Button size="sm" variant="outline" onClick={() => resolveRecall(batch)}>Resolve Issue</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BatchRecall;
