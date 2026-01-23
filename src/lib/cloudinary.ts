import { getCloudinarySignature } from "@/app/actions";

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    resource_type: "image" | "video";
    format: string;
}

export async function uploadToCloudinary(
    file: File
): Promise<CloudinaryUploadResult> {
    // Get signature from server
    const { signature, timestamp, folder } = await getCloudinarySignature();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", folder);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Upload failed");
    }

    return response.json();
}
