import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function AwardEditDialog({ open, onClose, onSave, editData }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
      setExistingImage(editData.image || "");
      setImageFile(null);
      setPreviewUrl("");
    } else {
      setName("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl("");
      setExistingImage("");
    }
  }, [editData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (editData?._id) formData.append("_id", editData._id);
    formData.append("name", name);
    formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (existingImage) {
      formData.append("image", existingImage);
    }

    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Award" : "Add Award"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Award name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Award description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {(previewUrl || existingImage) && (
              <img
                src={previewUrl || existingImage}
                alt="Preview"
                className="w-24 h-24 rounded-full border object-cover mt-2"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
