
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProducerService, ProducerProfile } from '@/services/producerService';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ComplianceProfile = () => {
    const { toast } = useToast();
    const [profile, setProfile] = useState<ProducerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            const data = await ProducerService.getProfile();
            setProfile(data);
            setLoading(false);
        };
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (value: string) => {
        if (!profile) return;
        setProfile({ ...profile, businessType: value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setSaving(true);
        try {
            const updated = await ProducerService.updateProfile(profile);
            setProfile(updated);
            toast({ title: "Profile Updated", description: "Your compliance details have been saved." });
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !profile) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Compliance Profile</h1>
                    <p className="text-muted-foreground">Manage your FBO identity and legal details.</p>
                </div>
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{profile.trustScore}/100</div>
                            <div className="text-xs text-muted-foreground font-semibold uppercase">Trust Score</div>
                        </div>
                        <div className="h-10 w-px bg-border"></div>
                        <div>
                            {profile.verificationStatus === 'VERIFIED_DEMO' ? (
                                <Badge className="bg-green-600 hover:bg-green-700">Verified Identity</Badge>
                            ) : (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">Unverified</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Details</CardTitle>
                            <CardDescription>This information will appear on public batch pages.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Registered Business Name</Label>
                                    <Input id="businessName" name="businessName" value={profile.businessName} onChange={handleChange} placeholder="e.g. Earthy Foods Pvt Ltd" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fssaiLicenseNo">FSSAI License No.</Label>
                                        <Input id="fssaiLicenseNo" name="fssaiLicenseNo" value={profile.fssaiLicenseNo} onChange={handleChange} placeholder="14-digit number" maxLength={14} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="businessType">Business Type</Label>
                                        <Select onValueChange={handleTypeChange} defaultValue={profile.businessType}>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                                                <SelectItem value="Marketer">Marketer</SelectItem>
                                                <SelectItem value="Packer">Packer</SelectItem>
                                                <SelectItem value="Importer">Importer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Registered Address</Label>
                                    <Input id="address" name="address" value={profile.address} onChange={handleChange} placeholder="Full postal address" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPhone">Customer Care Phone</Label>
                                        <Input id="contactPhone" name="contactPhone" value={profile.contactPhone} onChange={handleChange} placeholder="+91..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactEmail">Customer Care Email</Label>
                                        <Input id="contactEmail" name="contactEmail" value={profile.contactEmail} onChange={handleChange} placeholder="care@brand.com" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" disabled={saving}>
                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save & Verify Details
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Compliance Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-2 text-sm">
                                {profile.fssaiLicenseNo ? <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />}
                                <div>
                                    <p className="font-medium">FSSAI License</p>
                                    <p className="text-xs text-muted-foreground">{profile.fssaiLicenseNo ? "Provided" : "Required for trust score"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                {profile.contactPhone ? <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />}
                                <div>
                                    <p className="font-medium">Contact Info</p>
                                    <p className="text-xs text-muted-foreground">Essential for consumer support.</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 mt-4">
                                <strong>Tip:</strong> Completing your profile increases your product's visibility and consumer trust score on the app.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ComplianceProfile;
