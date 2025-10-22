"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

const fontSizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];

function AppearancePreviewCard({ fontSize, showImage }: { fontSize: string; showImage: boolean }) {
  return (
    <Card className="w-full overflow-hidden">
      {showImage && (
        <div className="bg-muted aspect-[16/9] w-full flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        <p className={cn("leading-tight", fontSize)}>
          This is how the text will look. Adjust the slider below to change the size.
        </p>
        <div className="flex gap-2 text-xs">
          <div className="flex-1 p-2 rounded-sm bg-primary text-primary-foreground text-center">Primary</div>
          <div className="flex-1 p-2 rounded-sm bg-secondary text-secondary-foreground text-center">Secondary</div>
          <div className="flex-1 p-2 rounded-sm bg-accent text-accent-foreground text-center">Accent</div>
        </div>
      </CardContent>
    </Card>
  );
}

type AppearanceViewProps = {
  stagedFontSize: string;
  setStagedFontSize: (value: string) => void;
  stagedShowImages: boolean;
  setStagedShowImages: (value: boolean) => void;
};

export function AppearanceView({
  stagedFontSize,
  setStagedFontSize,
  stagedShowImages,
  setStagedShowImages,
}: AppearanceViewProps) {
  const currentSizeIndex = fontSizes.indexOf(stagedFontSize);

  return (
    <div className="space-y-8">
      <AppearancePreviewCard fontSize={stagedFontSize} showImage={stagedShowImages} />
      <div className="grid gap-6">
        <div className="grid grid-cols-1 items-center gap-2">
          <Label>Font Size</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm">A</span>
            <Slider
              value={[currentSizeIndex]}
              onValueChange={(value) => setStagedFontSize(fontSizes[value[0]])}
              max={fontSizes.length - 1}
              step={1}
            />
            <span className="text-xl">A</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Show Images</Label>
          <Switch checked={stagedShowImages} onCheckedChange={setStagedShowImages} />
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}