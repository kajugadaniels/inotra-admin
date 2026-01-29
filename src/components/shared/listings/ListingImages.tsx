import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ListingImagesProps = {
    form: ListingFormState;
    existingImages: PlaceImage[];
    onImagesChange: (files: File[]) => void;
    onToggleRemoveImage?: (imageId: string) => void;
    disabled?: boolean;
};

const ListingImages = ({ form, existingImages, onImagesChange, onToggleRemoveImage, disabled }: ListingImagesProps) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => onImagesChange(acceptedFiles),
        multiple: true,
        disabled: disabled,
    });

    return (
        <div>
            <label className="text-sm">Upload images (optional)</label>
            <div {...getRootProps()} className="mt-2 p-4 border border-dashed rounded-lg text-center">
                <input {...getInputProps()} />
                <p>Drag & drop some files here, or click to select files</p>
            </div>
            {form.images.length ? (
                <div className="mt-4">
                    {form.images.map((file, index) => (
                        <div key={index} className="flex items-center">
                            <Image src={URL.createObjectURL(file)} alt="Uploaded image" width={100} height={100} />
                            <Button
                                onClick={() => {
                                    const nextImages = form.images.filter((_, i) => i !== index);
                                    onImagesChange(nextImages);
                                }}
                                variant="ghost"
                                className="ml-2"
                                disabled={disabled}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default ListingImages;
