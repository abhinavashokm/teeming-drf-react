import { globalQueryKeys } from "../../constants/queryKeys";
import authService from "../../services/authService";
import { s3Service } from "../../services/s3Service";
import { workspaceService } from "../../services/workspaceService";
import useAppMutation from "../base/useAppMutation";

const useUploadProfilePic = () => {

    return useAppMutation({
        mutationFn: async (file) => {

            //step 1: get upload url for uploading to s3 bucket
            const { data: { uploadUrl, fileKey } } =
                await authService.createProfilePicUploadUrl({ "contentType": file.type });

            //step 2: upload to s3 bucket
            await s3Service.uploadLogoToS3(uploadUrl, file);

            //step 3: save file key of part of url in db
            return authService.saveProfilePic({ "avatarKey": fileKey })

        },
        onError: (error) => {
            console.log(error)
        },
        apiSuccessToast: false,
        invalidateKeys: [globalQueryKeys.auth],
    });
};

export default useUploadProfilePic