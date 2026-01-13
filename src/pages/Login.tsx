import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, ChevronRight, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { setAuthUser } from '@/lib/storage';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setAuthUser({ userId: 'dummy', name: 'My Profile' });
    navigate('/');
  };

  const handleGuestLogin = () => {
    setAuthUser({ userId: 'guest', name: 'Guest User' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background px-4 py-16">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-primary mx-auto flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue protecting your health</p>
        </div>

        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full h-12 bg-primary font-medium"
            >
              Sign In
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground px-2">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            onClick={handleGuestLogin}
            className="h-12 gap-2"
          >
            <User className="w-4 h-4" />
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;