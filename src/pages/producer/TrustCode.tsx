
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProducerService, Product } from '@/services/producerService';
import { Loader2, QrCode, Copy, ExternalLink, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const TrustCode = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        productId: '',
        batchId: '',
        mfgDate: '',
        expDate: ''
    });

    const [generatedBatch, setGeneratedBatch] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Load products for dropdown
        const loadProducts = async () => {
            // Ensure at least one mock product exists
            let prods = await ProducerService.getProducts();
            if (prods.length === 0) {
                await ProducerService.createProduct({
                    name: "Millet Cookies",
                    category: "Bakery",
                    netQty: "200g",
                    vegMark: true,
                    ingredients: ["Ragi", "Wheat", "Jaggery"],
                    allergens: ["Wheat", "Milk"],
                    nutrients: { energy: 450, protein: 8, carbs: 65, sugar: 18, fat: 18, satFat: 5, transFat: 0, sodium: 120 },
                    claims: { organic: true, fortified: false, odop: false, shgFpo: true }
                });
                prods = await ProducerService.getProducts();
            }
            setProducts(prods);
            setLoading(false);
        };
        loadProducts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProductChange = (val: string) => {
        setFormData({ ...formData, productId: val });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId) return;

        setSubmitting(true);
        try {
            const product = products.find(p => p.id === formData.productId);
            const batch = await ProducerService.createBatch({
                productId: formData.productId,
                productName: product?.name || 'Unknown Product',
                batchId: formData.batchId,
                mfgDate: formData.mfgDate,
                expDate: formData.expDate
            });

            setGeneratedBatch(batch);
            toast({
                title: "Trust Code Generated",
                description: "QR code is ready linked to your product batch.",
            });
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedBatch) {
            navigator.clipboard.writeText(generatedBatch.trustCode);
            toast({ description: "Trust Code copied to clipboard" });
        }
    };

    if (loading) return <div className="p-8 text-center">Loading products...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trust Code Generation</h1>
                    <p className="text-muted-foreground">Create traceable batch identifiers linked to your product identity.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Batch Details</CardTitle>
                        <CardDescription>Select product and enter production dates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Product</Label>
                                <Select onValueChange={handleProductChange} value={formData.productId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose product..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.netQty})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {products.length === 0 && <p className="text-xs text-muted-foreground">No products found. Create one in Label Wizard first.</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="batchId">Batch Number / Lot No.</Label>
                                <Input id="batchId" name="batchId" placeholder="e.g. B-2024-JAN-01" value={formData.batchId} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mfgDate">Date of Mfg</Label>
                                    <Input id="mfgDate" name="mfgDate" type="date" value={formData.mfgDate} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expDate">Expiry / Best Before</Label>
                                    <Input id="expDate" name="expDate" type="date" value={formData.expDate} onChange={handleChange} required />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting || !formData.productId}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Traceable QR
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div>
                    {generatedBatch ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <Card className="bg-primary/5 border-primary/20 text-center">
                                <CardHeader>
                                    <CardTitle className="text-primary">Trust Code Generated</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-6">
                                    <div className="bg-white p-4 rounded-xl shadow-lg border">
                                        <QrCode className="w-48 h-48 text-primary" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-mono text-2xl font-bold tracking-widest">{generatedBatch.trustCode}</h3>
                                        <p className="text-sm text-muted-foreground">Unique Batch Identifier</p>
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                                            <Copy className="w-4 h-4 mr-2" /> Copy
                                        </Button>
                                        <Button className="flex-1" asChild>
                                            <Link to={`/verify/${generatedBatch.trustCode}`} target="_blank">
                                                <ExternalLink className="w-4 h-4 mr-2" /> Test Public Page
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-sm text-muted-foreground">
                                    <h4 className="font-semibold text-foreground mb-2">What happens next?</h4>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>The generated QR points to the public verification page.</li>
                                        <li>Consumers scan this to see Product, Producer, and Batch Validity.</li>
                                        <li>You can manage this batch's status in the "Batch & Recall" tab.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                            <QrCode className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No Code Generated</p>
                            <p className="text-sm max-w-xs">Fill the details on the left to create a unique Trust Code for your batch.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrustCode;
