import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, File as FileIcon } from "lucide-react";
import { type File } from "@shared/schema";

interface FileTreeProps {
  files: File[];
  onFileSelect: (file: File) => void;
}

export function FileTree({ files, onFileSelect }: FileTreeProps) {
  const groupedFiles = files.reduce((acc, file) => {
    const parts = file.path.split("/");
    let current = acc;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    const fileName = parts[parts.length - 1];
    current[fileName] = file;
    
    return acc;
  }, {} as Record<string, any>);

  const renderTree = (node: Record<string, any>, path: string = "") => {
    return Object.entries(node).map(([key, value]) => {
      const fullPath = path ? `${path}/${key}` : key;
      const isFile = "content" in value;

      return (
        <div key={fullPath} className="ml-4">
          <div
            className={`flex items-center gap-2 p-1 rounded hover:bg-accent ${
              isFile ? "cursor-pointer" : ""
            }`}
            onClick={() => isFile && onFileSelect(value)}
          >
            {isFile ? (
              <FileIcon className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )}
            <span>{key}</span>
          </div>
          {!isFile && renderTree(value, fullPath)}
        </div>
      );
    });
  };

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Generated Files</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {renderTree(groupedFiles)}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
