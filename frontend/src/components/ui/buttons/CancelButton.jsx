import AppButton from "./AppButton"
import { cn } from "../../../utils/cn"

export default function CancelButton({ onClick, className = '', ...props }) {
    return (
        <AppButton
            variant="secondary"
            className={cn('flex-1 sm:flex-none', className)}
            onClick={onClick}
            {...props}
        >
            Cancel
        </AppButton>
    )
}