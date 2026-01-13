import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile, profileTypes, healthConditions, allergies, dietaryPreferences } from '@/types/profile';
import { User, Plus, PenSquare } from 'lucide-react';

interface ProfileSwitcherProps {
  profiles: UserProfile[];
  activeProfileId: string;
  onSwitch: (profileId: string) => void;
  onEdit: (profile: UserProfile) => void;
  onAdd: () => void;
}

export const ProfileSwitcher = ({
  profiles,
  activeProfileId,
  onSwitch,
  onEdit,
  onAdd
}: ProfileSwitcherProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="w-4 h-4" />
          Switch Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Profile</DialogTitle>
          <DialogDescription>
            Select a profile to manage different health preferences
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3 py-4">
            {profiles.map((profile) => (
              <Card key={profile.id} className={profile.id === activeProfileId ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{profile.name}</h4>
                      <div className="flex gap-1.5">
                        <Badge variant="secondary">{profile.type}</Badge>
                        {profile.diet !== 'none' && (
                          <Badge variant="outline">{profile.diet}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(profile)}
                      >
                        <PenSquare className="w-4 h-4" />
                      </Button>
                      {profile.id !== activeProfileId && (
                        <Button
                          size="sm"
                          onClick={() => onSwitch(profile.id)}
                        >
                          Switch
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};