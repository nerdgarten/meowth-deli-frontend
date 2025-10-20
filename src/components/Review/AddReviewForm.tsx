import { useMutation } from "@tanstack/react-query";
import { Plus, Star, Upload } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

import type { SubmitReviewData } from "@/queries/reviews";
import { submitDriverReview, submitRestaurantReview } from "@/queries/reviews";

interface AddReviewFormProps {
  type: "driver" | "restaurant";
  id: number;
  orderId: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const AddReviewForm: FC<AddReviewFormProps> = ({
  type,
  id,
  orderId,
  onSuccess,
  onError,
}) => {
  // --- State for the form fields ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // State for the star rating
  const [rating, setRating] = useState(0); // 0 = no rating
  const [hoverRating, setHoverRating] = useState(0); // For hover effect

  // State for the file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State for tags
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // --- Mutation for submitting review ---
  const submitReviewMutation = useMutation({
    mutationFn: (reviewData: SubmitReviewData) => {
      if (type === "driver") {
        return submitDriverReview(id, reviewData);
      } else {
        return submitRestaurantReview(id, reviewData);
      }
    },
    onSuccess: () => {
      // Reset form
      setTitle("");
      setDescription("");
      setRating(0);
      setSelectedFile(null);
      setTags([]);
      setNewTag("");
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // --- Handlers ---
  const handleRatingClick = (index: number) => {
    // Set rating (1-5)
    setRating(index + 1);
  };

  const handleRatingHover = (index: number) => {
    // Set hover rating (1-5)
    setHoverRating(index + 1);
  };

  const handleRatingLeave = () => {
    // Reset hover state when mouse leaves
    setHoverRating(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const reviewData: SubmitReviewData = {
      orderId,
      rate: rating,
      reviewText: description || undefined,
    };

    submitReviewMutation.mutate(reviewData);
  };

  // Use `hoverRating` if it's set, otherwise use the actual `rating`
  const displayRating = hoverRating || rating;
  const maxStars = 5;

  return (
    // Main card container
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-2xl bg-gray-50 p-6 font-sans shadow-sm"
    >
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Column: Form Inputs */}
        <div className="flex-1 space-y-4">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Edit Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-2xl font-bold text-gray-700 placeholder-gray-400 focus:outline-none"
          />

          {/* Star Rating */}
          <div className="flex items-center" onMouseLeave={handleRatingLeave}>
            {Array.from({ length: maxStars }).map((_, index) => (
              <Star
                key={index}
                size={28} // Larger stars for clicking
                className={`cursor-pointer ${
                  index < displayRating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={index < displayRating ? "currentColor" : "none"}
                onClick={() => handleRatingClick(index)}
                onMouseEnter={() => handleRatingHover(index)}
              />
            ))}
          </div>

          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-yellow-200 px-3 py-1 text-sm font-medium text-yellow-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Description Textarea */}
          <textarea
            placeholder="add description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-36 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        {/* Right Column: Photo Upload */}
        <div className="w-full md:w-1/3">
          {/* File Upload Area (styled label) */}
          <label
            htmlFor={`photo-upload-${type}-${id}`}
            className="flex h-full min-h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-200/70 p-4 transition-colors hover:bg-gray-200"
          >
            {selectedFile ? (
              // Show file name if selected
              <div className="text-center">
                <p className="text-sm font-medium break-all text-gray-800">
                  {selectedFile.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">Click to change</p>
              </div>
            ) : (
              // Show upload prompt
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Upload size={24} className="mb-2" />
                <span className="text-center text-sm font-medium">
                  Click to upload photo
                </span>
              </div>
            )}
          </label>
          {/* Hidden actual file input */}
          <input
            id={`photo-upload-${type}-${id}`}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={submitReviewMutation.isPending || rating === 0}
          className="rounded-lg bg-yellow-500 px-6 py-2 font-medium text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Error Message */}
      {submitReviewMutation.isError && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm">
            Error submitting review: {submitReviewMutation.error?.message}
          </p>
        </div>
      )}
    </form>
  );
};

export default AddReviewForm;
