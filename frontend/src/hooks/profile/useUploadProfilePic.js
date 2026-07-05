import { globalQueryKeys } from "../../constants/queryKeys";
import authService from "../../services/authService";
import { s3Service } from "../../services/s3Service";
import { workspaceService } from "../../services/workspaceService";
import useAppMutation from "../base/useAppMutation";
import { prepareAvatarUploads } from "../../utils/fileUtils";


const useUploadProfilePic = () => {

    return useAppMutation({
        mutationFn: async (file) => {

            //compress and prepare full and thumbnail versions of the image
            const { thumb, full } = await prepareAvatarUploads(file)

            //step 1: get upload url for uploading to s3 bucket
            const { data: { thumbUploadUrl, fullUploadUrl, thumbFileKey, fullFileKey } } =
                await authService.createProfilePicUploadUrl({ "contentType": full.type });

            //step 2: upload to s3 bucket
            await Promise.all([
                s3Service.uploadLogoToS3(thumbUploadUrl, thumb),
                s3Service.uploadLogoToS3(fullUploadUrl, full),
            ]);

            //step 3: save file key of part of url in db
            return authService.saveProfilePic({ "avatar_thumb_key": thumbFileKey, "avatar_full_key": fullFileKey })

        },
        onError: (error) => {
            console.log(error)
        },
        apiSuccessToast: false,
        invalidateKeys: [globalQueryKeys.auth],
    });
};

export default useUploadProfilePic