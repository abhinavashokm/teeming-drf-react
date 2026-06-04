import { useParams } from "react-router-dom"


export default function useGoalId() {
    const { goalId } = useParams()
    return goalId
}