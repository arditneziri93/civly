import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  IconDotsVertical,
  IconEdit,
  IconShare,
  IconCopy,
  IconFileTypePdf,
  IconTrash,
} from '@tabler/icons-react'

interface ResumeCardMenuProps {
  onEdit?: () => void
  onShare?: () => void
  onDuplicate?: () => void
  onExportPdf?: () => void
  onDelete?: () => void
}

export function ResumeCardMenu({
  onEdit,
  onShare,
  onDuplicate,
  onExportPdf,
  onDelete,
}: ResumeCardMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <IconDotsVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={8}
        className="min-w-48"
      >
        <DropdownMenuItem onClick={onEdit} className="hover:!bg-primary/10">
          <IconEdit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare} className="hover:!bg-primary/10">
          <IconShare className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDuplicate}
          className="hover:!bg-primary/10"
        >
          <IconCopy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onExportPdf}
          className="hover:!bg-primary/10"
        >
          <IconFileTypePdf className="mr-2 h-4 w-4" />
          Export PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="hover:!bg-primary/10">
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
