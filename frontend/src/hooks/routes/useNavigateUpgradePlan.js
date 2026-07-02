import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';
import useWorkspace from '../workspace/useWorkspace';

export default function useNavigateUpgradePlan() {
    const navigate = useNavigate();
    const { data: currentWorkspace } = useWorkspace();

    return () => {
        if (!currentWorkspace?.slug) return;
        navigate(ROUTE_PATHS.UPGRADE_PLAN(currentWorkspace.slug));
    };
}