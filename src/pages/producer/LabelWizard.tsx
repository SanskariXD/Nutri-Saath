
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ProducerService, ProducerProfile } from '@/services/producerService';
import { Loader2, CheckCircle, AlertTriangle, FileText, ChevronRight, ChevronLeft, ShieldCheck, Download } from 'lucide-react';

const LabelWizard = () => {
    const [profile, setProfile] = useState<ProducerProfile | null>(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [draftResult, setDraftResult] = useState<any>(null);

    const [formData, setFormData] = useState({
        // Step 1: Identity
        name: '',
        brand: '',
        category: '',
        variant: '',
        netQty: '',
        vegMark: true,

        // Step 2: Ingr & Allergens
        ingredients: '',
        allergens: {
            milk: false,
            nuts: false,
            wheat: false,
            soy: false
        },

        // Step 3: Nutrition
        energy: '',
        protein: '',
        carbs: '',
        totalSugar: '',
        addedSugar: '',
        totalFat: '',
        satFat: '',
        transFat: '',
        sodium: '',

        // Step 4: Compliance (Auto-filled primarily)
        fssaiLicense: '',
        mfgDetails: '',

        // Step 5: Claims
        isOrganic: false,
        organicCertId: '',
        isFortified: false,
        fortificants: '',
        isOdop: false,
        odopDistrict: '',
        isShg: false,
        groupName: ''
    });

    useEffect(() => {
        // Load profile for auto-fill
        ProducerService.getProfile().then(p => {
            setProfile(p);
            setFormData(curr => ({
                ...curr,
                fssaiLicense: p.fssaiLicenseNo,
                mfgDetails: `${p.businessName}, ${p.address}`
            }));
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData({ ...formData, [name]: checked });
    }

    const handleAllergenChange = (key: string, checked: boolean) => {
        setFormData({
            ...formData,
            allergens: { ...formData.allergens, [key]: checked }
        });
    }

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleGenerate = async () => {
        setLoading(true);
        // Simulate API call to generate draft
        try {
            const result = await ProducerService.createLabelDraft({
                name: formData.name,
                category: formData.category,
                nutrients: {
                    energy: Number(formData.energy),
                    protein: Number(formData.protein),
                    sugar: Number(formData.totalSugar),
                    salt: Number(formData.sodium) / 1000 // approx conversion if needed, demo logic
                },
                claims: {
                    organic: formData.isOrganic,
                    fortified: formData.isFortified,
                    odop: formData.isOdop
                }
            });
            setDraftResult(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Product Name</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Millet Cookies" />
                            </div>
                            <div className="space-y-2">
                                <Label>Brand Name (Optional)</Label>
                                <Input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. EarthyBites" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, category: v })} value={formData.category}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bakery">Bakery</SelectItem>
                                        <SelectItem value="Snacks">Snacks / Savory</SelectItem>
                                        <SelectItem value="Beverage">Beverage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Net Quantity</Label>
                                <Input name="netQty" value={formData.netQty} onChange={handleChange} placeholder="e.g. 200g" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <Label>Is this product Vegetarian?</Label>
                            <Switch checked={formData.vegMark} onCheckedChange={(c) => handleSwitchChange('vegMark', c)} />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <Label>Ingredients List (descending order)</Label>
                            <Textarea name="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="e.g. Ragi Flour (40%), Whole Wheat Flour, Jaggery, Butter..." className="h-24" />
                        </div>
                        <div className="space-y-2">
                            <Label>Allergens (Check if present)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(formData.allergens).map(([key, val]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Switch checked={val} onCheckedChange={(c) => handleAllergenChange(key, c)} />
                                        <span className="capitalize">{key}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-sm text-muted-foreground">Values per 100g / 100ml</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2"><Label>Energy (kcal)</Label><Input name="energy" type="number" value={formData.energy} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Protein (g)</Label><Input name="protein" type="number" value={formData.protein} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Carbs (g)</Label><Input name="carbs" type="number" value={formData.carbs} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Total Sugar (g)</Label><Input name="totalSugar" type="number" value={formData.totalSugar} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Added Sugar (g)</Label><Input name="addedSugar" type="number" value={formData.addedSugar} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Total Fat (g)</Label><Input name="totalFat" type="number" value={formData.totalFat} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Saturated Fat (g)</Label><Input name="satFat" type="number" value={formData.satFat} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Trans Fat (g)</Label><Input name="transFat" type="number" value={formData.transFat} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label>Sodium (mg)</Label><Input name="sodium" type="number" value={formData.sodium} onChange={handleChange} /></div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <Label>FSSAI License No (Auto-filled)</Label>
                            <Input name="fssaiLicense" value={formData.fssaiLicense} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Manufacturer Details</Label>
                            <Textarea name="mfgDetails" value={formData.mfgDetails} onChange={handleChange} className="h-20" />
                        </div>
                        <div className="p-4 bg-yellow-50 rounded text-sm text-yellow-800 border border-yellow-200">
                            <strong>Note:</strong> Ensure "Best Before" and "Date of Mfg" placeholders are printed on the final pack batch-wise.
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="border p-4 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold">Organic (Jaivik Bharat)</Label>
                                <Switch checked={formData.isOrganic} onCheckedChange={(c) => handleSwitchChange('isOrganic', c)} />
                            </div>
                            {formData.isOrganic && (
                                <div className="pl-4 border-l-2 space-y-2">
                                    <Label>Certificate ID (NPOP/PGS)</Label>
                                    <Input name="organicCertId" value={formData.organicCertId} onChange={handleChange} placeholder="e.g. ORG-2024-XXXX" />
                                </div>
                            )}
                        </div>

                        <div className="border p-4 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold">Fortified (+F)</Label>
                                <Switch checked={formData.isFortified} onCheckedChange={(c) => handleSwitchChange('isFortified', c)} />
                            </div>
                            {formData.isFortified && (
                                <div className="pl-4 border-l-2 space-y-2">
                                    <Label>Fortificants (e.g. Iron, Folic Acid)</Label>
                                    <Input name="fortificants" value={formData.fortificants} onChange={handleChange} />
                                </div>
                            )}
                        </div>

                        <div className="border p-4 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold">ODOP Product</Label>
                                <Switch checked={formData.isOdop} onCheckedChange={(c) => handleSwitchChange('isOdop', c)} />
                            </div>
                            {formData.isOdop && (
                                <div className="pl-4 border-l-2 space-y-2">
                                    <Label>District & State</Label>
                                    <Input name="odopDistrict" value={formData.odopDistrict} onChange={handleChange} placeholder="e.g. Tumakuru, Karnataka" />
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Label Draft Generator</h1>
                    <p className="text-muted-foreground">Create compliant labels in 5 easy steps.</p>
                </div>

                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`h-2 flex-1 rounded-full min-w-[40px] ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
                    ))}
                </div>

                <Card className="min-h-[500px] flex flex-col">
                    <CardHeader>
                        <CardTitle>
                            Step {step}: {
                                ['Product Identity', 'Ingredients', 'Nutrition', 'Compliance', 'Claims'][step - 1]
                            }
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {renderStep()}
                    </CardContent>
                    <div className="p-6 border-t flex justify-between bg-muted/20">
                        <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>

                        {step < 5 ? (
                            <Button onClick={nextStep}>
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleGenerate} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Generate Draft
                            </Button>
                        )}
                    </div>
                </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:w-[450px]">
                {draftResult ? (
                    <Card className="bg-white shadow-xl border-primary/20 sticky top-6">
                        <CardHeader className="bg-primary/5 pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Draft Preview</CardTitle>
                                    <CardDescription>Generated based on your inputs</CardDescription>
                                </div>
                                <Badge className={
                                    draftResult.trafficLight === 'Green' ? "bg-green-600" :
                                        draftResult.trafficLight === 'Amber' ? "bg-yellow-600" : "bg-red-600"
                                }>
                                    Score: {draftResult.complianceScore}/100
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs defaultValue="front" className="w-full">
                                <TabsList className="w-full rounded-none border-b grid grid-cols-3">
                                    <TabsTrigger value="front">Front</TabsTrigger>
                                    <TabsTrigger value="back">Back</TabsTrigger>
                                    <TabsTrigger value="check">Checklist</TabsTrigger>
                                </TabsList>

                                <TabsContent value="front" className="p-6 space-y-6">
                                    <div className="border-2 border-black p-4 rounded-lg bg-orange-50/30 text-center relative min-h-[300px] flex flex-col items-center justify-center">
                                        {formData.vegMark ? (
                                            <div className="absolute top-4 right-4 border border-green-600 p-[2px] rounded h-4 w-4 flex items-center justify-center">
                                                <div className="h-2 w-2 bg-green-600 rounded-full" />
                                            </div>
                                        ) : (
                                            <div className="absolute top-4 right-4 border border-red-600 p-[2px] rounded h-4 w-4 flex items-center justify-center">
                                                <div className="h-2 w-2 bg-red-600 rounded-full" />
                                            </div>
                                        )}

                                        <h3 className="font-bold text-2xl mb-1">{formData.brand || 'BRAND'}</h3>
                                        <h4 className="text-xl mb-4 font-serif text-primary">{formData.name}</h4>

                                        <div className="flex gap-2 mb-6">
                                            {formData.isOrganic && <Badge variant="outline" className="border-green-600 text-green-700">Organic</Badge>}
                                            {formData.isFortified && <Badge variant="outline" className="border-blue-600 text-blue-700">+F Fortified</Badge>}
                                            {formData.isOdop && <Badge variant="outline" className="border-orange-600 text-orange-700">ODOP</Badge>}
                                        </div>

                                        <div className="absolute bottom-4 left-4 text-sm font-bold text-muted-foreground">
                                            Net Qty: {formData.netQty}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="back" className="p-6 space-y-4 text-xs font-mono">
                                    <div className="border p-4 bg-white rounded space-y-3">
                                        <div>
                                            <strong>Ingredients:</strong>
                                            <p>{formData.ingredients}</p>
                                        </div>
                                        <div>
                                            <strong>Nutrition Information:</strong>
                                            <div className="grid grid-cols-2 gap-x-4 border-t mt-1 pt-1">
                                                <span>Energy: {formData.energy}kcal</span>
                                                <span>Protein: {formData.protein}g</span>
                                                <span>Sugar: {formData.totalSugar}g</span>
                                                <span>Fat: {formData.totalFat}g</span>
                                            </div>
                                        </div>
                                        <div>
                                            <strong>Manufactured By:</strong>
                                            <p>{formData.mfgDetails}</p>
                                            <p>Lic. No. {formData.fssaiLicense}</p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="check" className="p-6">
                                    <div className="space-y-3">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-primary" /> Compliance Check
                                        </h4>

                                        <div className="space-y-2">
                                            <CheckItem label="Mandatory Fields" passed={draftResult.checklist.mandatoryElements} />
                                            <CheckItem label="Nutritional Info" passed={draftResult.checklist.nutrientsComplete} />
                                            <CheckItem label="Claim Substantiation" passed={draftResult.checklist.claimsValid} />
                                        </div>

                                        {draftResult.warnings.length > 0 && (
                                            <div className="bg-red-50 p-3 rounded border border-red-100 mt-4">
                                                <p className="font-bold text-red-700 text-xs mb-2">Needs Attention:</p>
                                                <ul className="list-disc pl-4 text-xs text-red-600 space-y-1">
                                                    {draftResult.warnings.map((w: string, i: number) => (
                                                        <li key={i}>{w}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                            <div className="p-4 bg-muted/30 border-t flex gap-2">
                                <Button className="w-full" variant="outline"><Download className="w-4 h-4 mr-2" /> PDF</Button>
                                <Button className="w-full">Save Draft</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                        <FileText className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Draft Preview</p>
                        <p className="text-sm">Complete the wizard steps to generate your label preview.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CheckItem = ({ label, passed }: { label: string, passed: boolean }) => (
    <div className="flex items-center justify-between p-2 rounded bg-muted/30">
        <span className="text-sm">{label}</span>
        {passed ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Pass</Badge>
        ) : (
            <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Check</Badge>
        )}
    </div>
)

export default LabelWizard;
