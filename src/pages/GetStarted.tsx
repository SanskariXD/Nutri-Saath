
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Factory, ArrowRight } from 'lucide-react';

const GetStarted = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-3">Choose how you use NutriSaath</h1>
                    <p className="text-muted-foreground">Select your role to get started with the right tools for you.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card
                        className="group hover:border-primary transition-all duration-300 cursor-pointer overflow-hidden relative"
                        onClick={() => navigate('/consumer')}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                        <CardContent className="p-8 flex flex-col items-center text-center h-full justify-between">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Consumer / Family</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Scan labels, see clear verdicts, and protect your family's health.
                                </p>
                            </div>
                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                Continue as Consumer <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card
                        className="group hover:border-secondary transition-all duration-300 cursor-pointer overflow-hidden relative"
                        onClick={() => navigate('/producer')}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary/20 group-hover:bg-secondary transition-colors" />
                        <CardContent className="p-8 flex flex-col items-center text-center h-full justify-between">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Factory className="w-8 h-8 text-secondary" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Producer / MSME</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Create compliant labels, manage batches, and build consumer trust.
                                </p>
                            </div>
                            <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-white transition-colors">
                                Continue as Producer <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 text-center">
                    <Button variant="link" onClick={() => navigate('/')} className="text-muted-foreground">
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
