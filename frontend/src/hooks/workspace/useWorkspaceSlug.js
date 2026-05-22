import { useParams } from "react-router-dom"


export default function useWorkspaceSlug() {
    const { workspaceSlug } = useParams()
    return workspaceSlug
}