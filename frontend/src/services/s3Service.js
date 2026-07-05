export const s3Service = {
    //react -> s3 bucket
    uploadLogoToS3: async (uploadUrl, file) => {
        const res = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
                // "Cache-Control": "public, max-age=31536000, immutable",
            },
            body: file,
        });

        if (!res.ok) {
            throw new Error("Failed to upload logo");
        }

        return true;
    },

}