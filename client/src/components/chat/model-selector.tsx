import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableModels, type ModelOption } from "@/lib/openrouter";

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model: ModelOption) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name} ({model.provider})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}