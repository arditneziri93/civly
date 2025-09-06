import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function NameField({ defaultName }: {defaultName: string}) {
    return (
    <div className="grid gap-3">
      <Label htmlFor="email">Name</Label>
      <Input
        id="name"
        name="name"
        type="text"
        placeholder="Tom Doe"
        defaultValue={defaultName}
        required
      />
    </div>
    );   
}