import AppButton from "../../../components/ui/buttons/AppButton"
import { cn } from "../../../utils/cn"

function AdminButton({ className = '', ...props }) {
    return (
        <AppButton
            variant="dark"
            size="lg"
            fullWidth
            className={cn(
                'h-[44px] font-bold text-[14px] leading-[21px]',
                'bg-[#1A1A2E] hover:bg-[#1A1A2E]/90',
                'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
                className
            )}
            {...props}
        />
    )
}

export default AdminButton