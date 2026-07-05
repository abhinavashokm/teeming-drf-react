import { useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import useAppMutation from "../base/useAppMutation";
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys";
import useWorkspace from "./useWorkspace";
import { s3Service } from "../../services/s3Service";
import { prepareAvatarUploads } from "../../utils/fileUtils";

const useUploadWorkspaceLogo = () => {

  const { data: currentWorkspace } = useWorkspace();
  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    mutationFn: async (file) => {

      //compress and prepare full and thumbnail versions of the image
      const { thumb, full } = await prepareAvatarUploads(file)

      const { data: { thumbUploadUrl, fullUploadUrl, thumbFileKey, fullFileKey } } =
        await workspaceService.createLogoUploadUrl(
          currentWorkspace.slug, full.type
        );

      await Promise.all([
        s3Service.uploadLogoToS3(thumbUploadUrl, thumb),
        s3Service.uploadLogoToS3(fullUploadUrl, full),
      ]);

      return workspaceService.saveWorkspaceLogo(
        currentWorkspace.slug,
        { "logo_thumb_key": thumbFileKey, "logo_full_key": fullFileKey }
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