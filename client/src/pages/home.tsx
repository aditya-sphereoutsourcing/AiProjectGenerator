import { useQuery } from "@tanstack/react-query";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FileTree } from "@/components/files/file-tree";
import { Terminal } from "@/components/terminal/terminal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { type File } from "@shared/schema";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: files = [] } = useQuery({
    queryKey: ["/api/files"],
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["/api/logs"],
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
        AI Code Generator
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ChatInterface />
        </div>
        <div>
          <FileTree files={files} onFileSelect={setSelectedFile} />
        </div>
      </div>
      
      <div className="mt-8">
        <Terminal logs={logs} />
      </div>

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-3xl">
          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
            <code>{selectedFile?.content}</code>
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
