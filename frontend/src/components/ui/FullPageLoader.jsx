import { LoaderCircle } from "lucide-react"


function FullPageLoader() {
    return (
        <div className="h-screen flex items-center justify-center">
            <LoaderCircle className="animate-spin" size={40} />
        </div>
    )
}

export default FullPageLoader