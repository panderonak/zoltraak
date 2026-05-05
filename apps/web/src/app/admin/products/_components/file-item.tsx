import { Button } from "@zoltraak/ui/components/button";
import { Progress } from "@zoltraak/ui/components/progress";
import { ImageIcon, X } from "lucide-react";
import { formatFileSize } from "@/lib/format-file-size";
import type { FileWithProgress } from "@/types";

interface FileItemProps {
  file: FileWithProgress;
  onRemove: (id: string) => void;
  uploading: boolean;
}

export function FileItem({ file, onRemove, uploading }: FileItemProps) {
  return (
    <div className="space-y-3 rounded-md border border-border bg-background p-4">
      <div className="flex items-center justify-between rounded-md bg-background p-3">
        <div className="flex items-center gap-3">
          {file.preview ? (
            <div className="size-10 overflow-hidden rounded">
              <img
                src={file.preview}
                alt={file.id}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <ImageIcon size={10} className="text-primary" />
          )}
          <div className="flex flex-col">
            <span className="truncate font-medium text-foreground text-sm">
              {file.file.name}
            </span>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span className="text-muted-foreground text-xs">
                {formatFileSize(file.file.size)}
              </span>
              <span>⋅</span>
              <span className="text-muted-foreground text-xs">
                {file.file.type || "Unknown type"}
              </span>
            </div>
          </div>
        </div>
        {!uploading && (
          <Button
            size={"icon-sm"}
            disabled={uploading}
            onClick={() => onRemove(file.id)}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-end pr-4 font-semibold text-primary text-xs">
        {file.uploaded ? "Completed" : `${Math.round(file.progress)}%`}
      </div>
      <Progress value={file.progress} />
    </div>
  );
}
