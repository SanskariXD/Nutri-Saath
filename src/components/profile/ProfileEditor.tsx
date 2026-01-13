import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile, profileTypes, healthConditions, allergies, dietaryPreferences } from '@/types/profile';

interface ProfileEditorProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

export const ProfileEditor = ({
  profile,
  isOpen,
  onClose,
  onSave
}: ProfileEditorProps) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    onSave(editedProfile);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Health Profile</DialogTitle>
          <DialogDescription>
            Update your health information for personalized recommendations
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-6 py-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Profile Name</Label>
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
              />
            </div>

            {/* Profile Type */}
            <div className="space-y-4">
              <Label>Profile Type</Label>
              <RadioGroup
                value={editedProfile.type}
                onValueChange={(value: 'adult' | 'child' | 'senior') => 
                  setEditedProfile({ ...editedProfile, type: value })
                }
              >
                {profileTypes.map(type => (
                  <div key={type.value} className="flex items-start space-x-2 p-2 cursor-pointer hover:bg-accent rounded-lg">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <div className="space-y-1">
                      <Label htmlFor={type.value} className="font-medium">{type.label}</Label>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Health Conditions */}
            <div className="space-y-4">
              <Label>Health Conditions</Label>
              <div className="grid gap-3">
                {healthConditions.map(condition => (
                  <div key={condition.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition.value}
                      checked={editedProfile.conditions.includes(condition.value)}
                      onCheckedChange={(checked) => {
                        setEditedProfile({
                          ...editedProfile,
                          conditions: checked
                            ? [...editedProfile.conditions, condition.value]
                            : editedProfile.conditions.filter(c => c !== condition.value)
                        });
                      }}
                    />
                    <Label htmlFor={condition.value}>{condition.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <Label>Food Allergies</Label>
              <div className="grid gap-3">
                {allergies.map(allergy => (
                  <div key={allergy.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy.value}
                      checked={editedProfile.allergies.includes(allergy.value)}
                      onCheckedChange={(checked) => {
                        setEditedProfile({
                          ...editedProfile,
                          allergies: checked
                            ? [...editedProfile.allergies, allergy.value]
                            : editedProfile.allergies.filter(a => a !== allergy.value)
                        });
                      }}
                    />
                    <Label htmlFor={allergy.value}>{allergy.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div className="space-y-4">
              <Label>Dietary Preference</Label>
              <RadioGroup
                value={editedProfile.diet}
                onValueChange={(value) => setEditedProfile({ ...editedProfile, diet: value })}
              >
                {dietaryPreferences.map(diet => (
                  <div key={diet.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={diet.value} id={diet.value} />
                    <Label htmlFor={diet.value}>{diet.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};