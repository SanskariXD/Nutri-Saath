
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Factory, Users, ShoppingBag, Truck, Info } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Hero Section */}
            <header className="bg-gradient-to-br from-primary/90 to-primary text-white py-16 px-6 text-center rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 pattern-grid-lg opacity-20" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        NutriSaath
                    </h1>
                    <p className="text-xl md:text-2xl font-medium mb-4 text-white/90">
                        Safer food labels for families, better markets for farmers.
                    </p>
                    <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto mb-8">
                        Empowering consumers with transparent food choices while helping producers creates compliant, trust-worthy products effortlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <Button
                            size="lg"
                            onClick={() => navigate('/consumer')}
                            className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            For Consumers & Families
                        </Button>
                        <Button
                            size="lg"
                            onClick={() => navigate('/producer')}
                            className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg px-8 py-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
                        >
                            <Factory className="w-5 h-5 mr-2" />
                            For Producers & MSMEs
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">

                {/* Two-Column Explainer */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Consumer Column */}
                    <Card className="border-t-4 border-t-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">For Families</h2>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground">Scan packs to see sugar, salt, fats, and allergens instantly.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Info className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground">Clear traffic-light verdicts on every product.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground">Get recall alerts and detailed ingredient explanations.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Producer Column */}
                    <Card className="border-t-4 border-t-secondary shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                                <Factory className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">For Producers</h2>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <ShieldCheck className="w-4 h-4 text-secondary" />
                                    </div>
                                    <span className="text-muted-foreground">Label-Ready Draft Wizard for effortless FSSAI compliance.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Truck className="w-4 h-4 text-secondary" />
                                    </div>
                                    <span className="text-muted-foreground">Generate Trust Code QRs for batch tracking and traceability.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Factory className="w-4 h-4 text-secondary" />
                                    </div>
                                    <span className="text-muted-foreground">Access market trend suggestions and batch recall dashboard.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Bridge of Benefits */}
                <div className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-12">
                    <h3 className="text-center text-xl font-bold mb-8 text-muted-foreground uppercase tracking-widest">Bridging the Gap</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-primary mb-2">Families</div>
                            <p className="text-sm text-muted-foreground">Safer food choices for every household.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-secondary mb-2">Producers</div>
                            <p className="text-sm text-muted-foreground">Faster compliance, better consumer trust.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary mb-2">Farmers</div>
                            <p className="text-sm text-muted-foreground">Better price realization & market visibility.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-secondary mb-2">Nation</div>
                            <p className="text-sm text-muted-foreground">Transparent food system & Atmanirbhar Bharat.</p>
                        </div>
                    </div>
                </div>

            </main>

            <footer className="bg-card border-t py-8 text-center text-sm text-muted-foreground">
                <p>© 2024 NutriSaath. Empowering India to Eat Better.</p>
            </footer>
        </div>
    );
};

export default Landing;
