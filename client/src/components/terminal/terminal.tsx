import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Log } from "@shared/schema";

interface TerminalProps {
  logs: Log[];
}

export function Terminal({ logs }: TerminalProps) {
  return (
    <Card className="h-[300px] bg-black text-green-400 font-mono">
      <CardHeader>
        <CardTitle className="text-green-400">Terminal Output</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{" "}
              <span className={`${log.level === "error" ? "text-red-400" : ""}`}>
                {log.message}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
