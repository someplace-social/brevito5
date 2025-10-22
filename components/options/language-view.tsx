"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LanguageViewProps = {
  stagedContentLanguage: string;
  setStagedContentLanguage: (value: string) => void;
  stagedTranslationLanguage: string;
  setStagedTranslationLanguage: (value: string) => void;
  stagedLevel: string;
  setStagedLevel: (value: string) => void;
  fontSize: string;
};

export function LanguageView({
  stagedContentLanguage,
  setStagedContentLanguage,
  stagedTranslationLanguage,
  setStagedTranslationLanguage,
  stagedLevel,
  setStagedLevel,
  fontSize,
}: LanguageViewProps) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 items-center gap-2">
        <Label className={fontSize}>Content</Label>
        <Select value={stagedContentLanguage} onValueChange={setStagedContentLanguage}>
          <SelectTrigger className={fontSize}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Italian">Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 items-center gap-2">
        <Label className={fontSize}>Translate To</Label>
        <Select value={stagedTranslationLanguage} onValueChange={setStagedTranslationLanguage}>
          <SelectTrigger className={fontSize}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Italian">Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 items-center gap-2">
        <Label className={fontSize}>Level</Label>
        <Select value={stagedLevel} onValueChange={setStagedLevel}>
          <SelectTrigger className={fontSize}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}