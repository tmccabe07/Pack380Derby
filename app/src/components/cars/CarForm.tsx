"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Car, getCarImage } from "@/lib/api/cars";
import { Racer } from "@/lib/api/racers";

interface CarFormProps {
  car: Omit<Car, "id">;
  onChange: (car: Omit<Car, "id">) => void;
  racer: Racer;
  hideSubmit?: boolean;
  onSubmit?: () => void; // parent handles submit
}
export default function CarForm({ car, onChange, racer, hideSubmit, onSubmit }: CarFormProps) {

  function handleChange<K extends keyof Omit<Car, "id">>(field: K, value: Omit<Car, "id">[K]) {
    onChange({ ...car, [field]: value });
  }

  const [imagePreview, setImagePreview] = useState<string>(car.image || "");
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    setImagePreview(car.image || "");
  }, [car.image]);

  function handleImageFile(file: File) {
    setImageError(null);
    if (!file.type.startsWith("image/")) {
      setImageError("File must be an image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
  onChange({ ...car, image: base64 });
    };
    reader.onerror = () => setImageError("Failed to read file");
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImagePreview("");
  onChange({ ...car, image: "" });
  }

  function handleInternalSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.();
  }

  return (
    <>
      <div className="mb-4 p-3 bg-gray-50 border rounded">
        <div><span className="font-bold">Racer:</span> {racer.name}</div>
        <div><span className="font-bold">Rank:</span> {racer.rank}</div>
        {racer.den && <div><span className="font-bold">Den:</span> {racer.den}</div>}
      </div>
  <form onSubmit={handleInternalSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Car Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={car.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Car Image</label>
          {imagePreview ? (
            <div className="mb-2">
              <Image src={getCarImage(imagePreview)} alt={car.name || "Car"} width={160} height={120} className="h-32 w-auto object-cover rounded border" />
            </div>
          ) : (
            <div className="h-32 w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded mb-2 border">No Image</div>
          )}
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
              className="text-sm"
            />
            {imagePreview && (
              <button type="button" onClick={removeImage} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Remove</button>
            )}
          </div>
          {imageError && <div className="text-red-600 text-xs mt-1">{imageError}</div>}
        </div>

        {/* Don't show or allow changing the year. In future associate with a competition.
        <div>
          <label className="block text-sm font-bold mb-1">Year</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={car.year}
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
            required
          />
        </div> */}

        <div>
          <label className="block text-sm font-bold mb-1">Weight</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={car.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
          />
        </div>

        {!hideSubmit && (
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Car
          </button>
        )}
      </form>
    </>
  );
}
