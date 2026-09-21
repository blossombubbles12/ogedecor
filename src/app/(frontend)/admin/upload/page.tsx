"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Video, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "@/app/actions";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface MediaFile {
    file: File;
    preview: string;
    type: "image" | "video";
    uploaded?: boolean;
    uploading?: boolean;
    publicId?: string;
    url?: string;
}

export default function AdminUploadPage() {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Residential",
        completionDate: "",
    });
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
            "video/*": [".mp4", ".mov"],
        },
        onDrop: (acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                type: file.type.startsWith("video") ? ("video" as const) : ("image" as const),
            }));
            setMediaFiles((prev) => [...prev, ...newFiles]);
        },
    });

    const removeFile = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            // Upload all media to Cloudinary
            const uploadedMedia = [];
            for (let i = 0; i < mediaFiles.length; i++) {
                setMediaFiles((prev) =>
                    prev.map((f, idx) => (idx === i ? { ...f, uploading: true } : f))
                );

                const result = await uploadToCloudinary(mediaFiles[i].file);

                setMediaFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? {
                                ...f,
                                uploading: false,
                                uploaded: true,
                                publicId: result.public_id,
                                url: result.secure_url,
                            }
                            : f
                    )
                );

                uploadedMedia.push({
                    url: result.secure_url,
                    type: result.resource_type,
                    publicId: result.public_id,
                });
            }

            // Save project to database
            const response = await createProject({
                ...formData,
                media: uploadedMedia,
            });

            if (response.success) {
                setSuccess(true);
                // Reset form
                setTimeout(() => {
                    setFormData({
                        title: "",
                        description: "",
                        category: "Residential",
                        completionDate: "",
                    });
                    setMediaFiles([]);
                    setSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload project. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-obsidian py-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-gold mb-4">Upload Project</h1>
                    <p className="text-white/60">Add a new project to the OgeDecor portfolio</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Project Details */}
                    <div className="bg-white/5 border border-white/10 p-8 space-y-6">
                        <h2 className="text-2xl font-serif text-sand mb-6">Project Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-sand mb-2">Project Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sand focus:border-gold focus:outline-none transition-colors"
                                placeholder="e.g., The Neo-Lagos Penthouse"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-sand mb-2">Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sand focus:border-gold focus:outline-none transition-colors resize-none"
                                placeholder="Describe the project..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-sand mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sand focus:border-gold focus:outline-none transition-colors"
                                >
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Custom Decor">Custom Decor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sand mb-2">Completion Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.completionDate}
                                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sand focus:border-gold focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="bg-white/5 border border-white/10 p-8">
                        <h2 className="text-2xl font-serif text-sand mb-6">Project Media</h2>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-sm p-12 text-center cursor-pointer transition-all ${isDragActive
                                    ? "border-gold bg-gold/10"
                                    : "border-white/20 hover:border-gold/50 hover:bg-white/5"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="mx-auto mb-4 text-gold" size={48} />
                            <p className="text-sand text-lg mb-2">
                                {isDragActive ? "Drop files here..." : "Drag & drop images or videos"}
                            </p>
                            <p className="text-white/40 text-sm">or click to browse</p>
                        </div>

                        {/* Preview Grid */}
                        {mediaFiles.length > 0 && (
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                                <AnimatePresence>
                                    {mediaFiles.map((media, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="relative aspect-square bg-black/40 rounded-sm overflow-hidden group"
                                        >
                                            {media.type === "image" ? (
                                                <img
                                                    src={media.preview}
                                                    alt={`Preview ${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Video className="text-gold" size={32} />
                                                </div>
                                            )}

                                            {/* Upload Status Overlay */}
                                            {media.uploading && (
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                                    <Loader2 className="text-gold animate-spin" size={32} />
                                                </div>
                                            )}

                                            {media.uploaded && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircle2 className="text-green-500" size={20} />
                                                </div>
                                            )}

                                            {/* Remove Button */}
                                            {!media.uploading && !uploading && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={16} className="text-white" />
                                                </button>
                                            )}

                                            {/* Type Badge */}
                                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                                                {media.type === "image" ? (
                                                    <ImageIcon size={12} />
                                                ) : (
                                                    <Video size={12} />
                                                )}
                                                {media.type}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={uploading || mediaFiles.length === 0}
                        className="w-full bg-gold hover:bg-white text-obsidian font-bold py-4 px-8 uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Uploading...
                            </>
                        ) : success ? (
                            <>
                                <CheckCircle2 size={20} />
                                Success!
                            </>
                        ) : (
                            "Publish Project"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
