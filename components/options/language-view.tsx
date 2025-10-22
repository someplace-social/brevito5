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
            <SelectItem value="English" className={fontSize}>English</SelectItem>
            <SelectItem value="Spanish" className={fontSize}>Spanish</SelectItem>
            <SelectItem value="French" className={fontSize}>French</SelectItem>
            <SelectItem value="German" className={fontSize}>German</SelectItem>
            <SelectItem value="Italian" className={fontSize}>Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 items-center gap-2">
        <Label className={fontSize}>Translate To</Label>
        <Select value={stagedTranslationLanguage} onValueChange={setStagedTranslationLanguage}>
          <SelectTrigger className={fontSize}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="English" className={fontSize}>English</SelectItem>
            <SelectItem value="Spanish" className={fontSize}>Spanish</SelectItem>
            <SelectItem value="French" className={fontSize}>French</SelectItem>
            <SelectItem value="German" className={fontSize}>German</SelectItem>
            <SelectItem value="Italian" className={fontSize}>Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 items-center gap-2">
        <Label className={fontSize}>Level</Label>
        <Select value={stagedLevel} onValueChange={setStagedLevel}>
          <SelectTrigger className={fontSize}><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner" className={fontSize}>Beginner</SelectItem>
            <SelectItem value="Intermediate" className={fontSize}>Intermediate</SelectItem>
            <SelectItem value="Advanced" className={fontSize}>Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}