import { useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import useAppMutation from "../base/useAppMutation";
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys";
import useWorkspace from "./useWorkspace";
import { s3Service } from "../../services/s3Service";

const useUploadWorkspaceLogo = () => {

  const { data: currentWorkspace } = useWorkspace();
  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    mutationFn: async (file) => {

      const { data: { uploadUrl, fileKey } } =
        await workspaceService.createLogoUploadUrl(
          currentWorkspace.slug, file.type
        );

      await s3Service.uploadLogoToS3(
        uploadUrl,
        file
      );

      return workspaceService.saveWorkspaceLogo(
        currentWorkspace.slug,
        fileKey
      );

    },
    onError: (error) => {
      console.log(error)
    },
    apiSuccessToast: false,
    invalidateKeys: [workspaceKeys.root],
  });
};

export default useUploadWorkspaceLogo