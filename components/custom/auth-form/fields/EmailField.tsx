import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function EmailField({ defaultName }: {defaultName: string}) {
    return (
    <div className="grid gap-3">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="m@example.com"
        defaultValue={defaultName}
        autoComplete='email'
        required
      />
    </div>
    );   
}