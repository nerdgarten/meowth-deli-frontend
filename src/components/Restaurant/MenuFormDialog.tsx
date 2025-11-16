"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import {
  Bean,
  Egg,
  Fish,
  Info,
  Leaf,
  Milk,
  Nut,
  Shell,
  Shrimp,
  Trash2,
  Upload,
  Wheat,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/libs/utils";

const ALLERGEN_KEYS = [
  "gluten",
  "peanuts",
  "seafood",
  "dairy",
  "eggs",
  "soy",
  "tree_nuts",
  "wheat",
  "fish",
  "shellfish",
] as const;

type Allergy = (typeof ALLERGEN_KEYS)[number];

const ALLERGENS: Array<{
  key: Allergy;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "eggs", label: "Eggs", Icon: Egg },
  { key: "dairy", label: "Dairy", Icon: Milk },
  { key: "soy", label: "Soy", Icon: Bean },
  { key: "tree_nuts", label: "Nuts", Icon: Nut },
  { key: "seafood", label: "Sea Foods", Icon: Shrimp },
  { key: "fish", label: "Fish", Icon: Fish },
  { key: "peanuts", label: "peanuts", Icon: Leaf },
  { key: "wheat", label: "Wheat", Icon: Wheat },
  { key: "shellfish", label: "Shellfish", Icon: Shell },
  { key: "gluten", label: "Gluten", Icon: Info },
];

const fileSchema = z.custom<File>(
  (v) => typeof File !== "undefined" && v instanceof File,
  { message: "Not a file" }
);

const fileOrUrlSchema = z
  .union([fileSchema, z.string().min(1)])
  .nullable()
  .optional();

const DishFormSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  detail: z.string().optional(),
  image: fileOrUrlSchema,
  allergies: z
    .array(z.enum([...ALLERGEN_KEYS] as [Allergy, ...Allergy[]]))
    .default([]),
});

type DishFormValues = z.infer<typeof DishFormSchema>;

export function AddMenuFormDialog() {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<DishFormValues>({
    resolver: zodResolver(
      DishFormSchema
    ) as unknown as Resolver<DishFormValues>,
    defaultValues: {
      name: "",
      price: 0,
      detail: "",
      image: null,
      allergies: [],
    } satisfies DishFormValues,
  });

  const watchedImage = form.watch("image");
  const [preview, setPreview] = useState<string>("");

  const hasImage = useMemo(
    () =>
      Boolean(preview || (watchedImage && typeof watchedImage !== "string")),
    [preview, watchedImage]
  );

  useEffect(() => {
    if (!watchedImage) {
      setPreview("");
      return;
    }
    if (typeof watchedImage === "string") {
      setPreview(watchedImage);
      return;
    }
    const url = URL.createObjectURL(watchedImage);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [watchedImage]);

  const toggleAllergy = (key: Allergy) => {
    const current = form.getValues("allergies");
    if (current.includes(key)) {
      form.setValue(
        "allergies",
        current.filter((item) => item !== key),
        { shouldDirty: true }
      );
    } else {
      form.setValue("allergies", [...current, key], { shouldDirty: true });
    }
  };

  const handleSubmit = (values: DishFormValues) => {
    // TODO: wire up create/update dish mutation
    console.info("submit dish", values);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-[#f5a77b] px-5 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-95">
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[75vh] w-[90vw] max-w-4xl overflow-y-auto rounded-[28px] border-none bg-[#fffaf2] p-0 shadow-[0_24px_60px_rgba(52,31,10,0.12)] sm:p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Menu Form</DialogTitle>
        </DialogHeader>
        <div className="rounded-[28px] bg-white px-6 py-6 text-[#2b2016]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Upload</FormLabel>
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6c8b0] bg-[#f7f0e2] p-6 text-center shadow-inner">
                        {hasImage ? (
                          <div className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-[#d6c8b0] bg-white">
                            <img
                              src={preview}
                              alt="Dish preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#d6c8b0]">
                              <Upload
                                className="size-5 text-[#8c7254]"
                                aria-hidden
                              />
                            </div>
                            <p className="mt-4 text-sm font-semibold text-[#8c7254]">
                              Click to upload photo
                            </p>
                          </>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 rounded-full border-[#d6c8b0] bg-white px-5 py-2 text-sm font-semibold text-[#6f553a] shadow-sm transition hover:bg-[#f2e6d4]"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload
                        </Button>
                        <FormControl>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              field.onChange(file);
                            }}
                          />
                        </FormControl>
                        {hasImage && (
                          <button
                            type="button"
                            className="mt-3 text-xs font-semibold text-[#c05b3c] underline"
                            onClick={() => field.onChange(null)}
                          >
                            Remove photo
                          </button>
                        )}
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-[#2d1f13]">
                          Item Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter item name"
                            className="h-auto rounded-xl border-[#ded2c0] bg-white px-4 py-3 text-sm text-[#2d1f13] shadow-inner focus:border-[#cfa46b] focus:ring-2 focus:ring-[#f5d9aa]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-[#2d1f13]">
                            Price (฿)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              value={field.value ?? ""}
                              onChange={(event) => {
                                const value = event.target.value;
                                field.onChange(value === "" ? "" : value);
                              }}
                              placeholder="0.00"
                              className="h-auto rounded-xl border-[#ded2c0] bg-white px-4 py-3 text-sm text-[#2d1f13] shadow-inner focus:border-[#cfa46b] focus:ring-2 focus:ring-[#f5d9aa]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-[#2d1f13]">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add description"
                          className="min-h-[80px] rounded-xl border-[#ded2c0] bg-white px-4 py-3 text-sm text-[#2d1f13] shadow-inner focus:border-[#cfa46b] focus:ring-2 focus:ring-[#f5d9aa]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={() => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-semibold text-[#2d1f13]">
                        Allergens
                      </FormLabel>
                      <div className="flex flex-wrap gap-3">
                        {ALLERGENS.map((item) => {
                          const isActive = form
                            .watch("allergies")
                            .includes(item.key);
                          return (
                            <Button
                              key={item.key}
                              type="button"
                              onClick={() => toggleAllergy(item.key)}
                              className={cn(
                                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition",
                                isActive
                                  ? "border-[#f5b700] bg-[#ffe69b] text-[#3c280f]"
                                  : "border-[#d6c8b0] bg-white text-[#6f553a] hover:bg-[#f5ecd9]"
                              )}
                              variant="outline"
                            >
                              <item.Icon className="size-4 text-[#6f553a]" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-[#d6c8b0] px-5 py-3 text-sm font-semibold text-[#6f553a] shadow-sm hover:bg-[#f5ecd9]"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                {/* <Button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-[#f45c3b] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,92,59,0.35)] transition hover:brightness-95 active:translate-y-[1px] active:brightness-90"
                >
                  Delete
                  <Trash2 className="size-4" aria-hidden />
                </Button> */}
                <Button
                  type="submit"
                  className="rounded-full bg-[#f5a77b] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-95"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
