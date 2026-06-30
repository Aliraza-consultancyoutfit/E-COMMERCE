"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Box, Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CrossIcon } from "@/assets/icons/common";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import { PATHS } from "@/constants/routes";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/store/products/products.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { fileToProductImageDataUrl } from "@/utils/image";

const schema = yup.object({
  name: yup.string().trim().required("Product name is required"),
  description: yup.string().default(""),
  category: yup.string().trim().required("Category is required"),
  images: yup.array(yup.string().required()).default([]),
  price: yup
    .number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("Price must be a number")
    .min(0, "Price can't be negative")
    .required("Price is required"),
  oldPrice: yup
    .number()
    .transform((value, original) => (original === "" ? 0 : value))
    .typeError("Must be a number")
    .min(0, "Can't be negative")
    .default(0),
  stock: yup
    .number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("Stock must be a number")
    .integer("Whole number only")
    .min(0, "Can't be negative")
    .required("Stock is required"),
});

type ProductFormValues = yup.InferType<typeof schema>;

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3 }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2.25 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const UploadGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

/**
 * Multi-image picker. Each file is stored as a base64 data URL in the form's
 * `images` array — no upload endpoint needed (mirrors the avatar flow). The
 * first image is the cover; previews also render existing http(s) URLs.
 */
function MultiImageUpload({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const encoded = await Promise.all(
        Array.from(files).map((file) => fileToProductImageDataUrl(file)),
      );
      onChange([...value, ...encoded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image");
    }
  };

  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index));

  const makeCover = (index: number) => {
    const next = [...value];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 1.5 }}>
        {value.map((src, index) => (
          <Box
            key={`${index}-${src.slice(-12)}`}
            sx={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 3, overflow: "hidden", border: 2, borderColor: index === 0 ? "primary.main" : "divider" }}
          >
            <Box component="img" src={src} alt={`Product image ${index + 1}`} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {index === 0 && (
              <Box sx={{ position: "absolute", top: 6, left: 6, px: 0.85, py: 0.25, borderRadius: 1, bgcolor: "primary.main", color: "primary.contrastText", fontSize: 10, fontWeight: 700 }}>
                Cover
              </Box>
            )}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: "absolute", bottom: 6, left: 6, right: 6 }}>
              {index !== 0 ? (
                <Button size="small" onClick={() => makeCover(index)} sx={{ minWidth: 0, px: 0.85, fontSize: 11, bgcolor: "background.paper", "&:hover": { bgcolor: "background.paper" } }}>
                  Set cover
                </Button>
              ) : (
                <Box />
              )}
              <IconButton size="small" aria-label="Remove image" onClick={() => removeAt(index)} sx={{ bgcolor: "background.paper", color: "error.main", "&:hover": { bgcolor: "background.paper" } }}>
                <CrossIcon width="14" height="14" stroke="currentColor" />
              </IconButton>
            </Stack>
          </Box>
        ))}

        <Box
          role="button"
          tabIndex={0}
          aria-label="Add product images"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void addFiles(e.dataTransfer.files);
          }}
          sx={{
            aspectRatio: "1 / 1",
            border: "1.5px dashed",
            borderColor: dragOver ? "primary.main" : "primary.light",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            outline: "none",
            color: "primary.main",
            bgcolor: (t) => alpha(t.palette.primary.main, dragOver ? 0.12 : 0.05),
            "&:focus-visible": { borderColor: "primary.main", boxShadow: (t) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.2)}` },
          }}
        >
          <UploadGlyph />
          <Typography variant="caption" fontWeight={600} sx={{ mt: 0.5 }}>
            Add
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
        PNG or JPG, up to 5MB each. The first image is the cover.
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </Box>
  );
}

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const { data: product, isLoading: loadingProduct } = useGetProductQuery(
    productId as string,
    { skip: !productId },
  );
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    values: product
      ? {
          name: product.name,
          description: product.description,
          category: product.category,
          images: product.images?.length
            ? product.images
            : product.image
              ? [product.image]
              : [],
          price: product.price,
          oldPrice: product.oldPrice,
          stock: product.stock,
        }
      : undefined,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      images: [],
      price: undefined,
      oldPrice: 0,
      stock: undefined,
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    const body = {
      name: values.name,
      description: values.description,
      category: values.category,
      image: values.images[0] ?? "",
      images: values.images,
      price: values.price,
      oldPrice: values.oldPrice,
      stock: values.stock,
    };
    try {
      if (isEdit && productId) {
        await updateProduct({ id: productId, body }).unwrap();
        toast.success("Product updated");
      } else {
        await createProduct(body).unwrap();
        toast.success("Product created");
      }
      router.push(PATHS.admin.products);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  if (isEdit && loadingProduct) {
    return <Skeleton variant="rounded" height={480} />;
  }

  return (
    <Box sx={{ maxWidth: 880 }}>
      <Typography
        component="span"
        variant="body2"
        color="primary.main"
        fontWeight={600}
        sx={{ cursor: "pointer", display: "inline-block", mb: 2 }}
        onClick={() => router.push(PATHS.admin.products)}
      >
        ← Back to products
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        {isEdit ? "Edit product" : "Add product"}
      </Typography>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <SectionCard title="General">
            <Stack spacing={2}>
              <RHFTextField name="name" label="Product name" placeholder="Aero Wireless Headphones" />
              <RHFTextField name="description" label="Description" placeholder="Short description" multiline minRows={3} />
            </Stack>
          </SectionCard>

          <SectionCard title="Media">
            <MultiImageUpload
              value={methods.watch("images") || []}
              onChange={(next) => methods.setValue("images", next, { shouldDirty: true })}
            />
          </SectionCard>

          <SectionCard title="Pricing & inventory">
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
              <RHFTextField name="price" label="Price ($)" type="number" placeholder="199" />
              <RHFTextField name="oldPrice" label="Compare at ($)" type="number" placeholder="249" />
              <RHFTextField name="stock" label="Stock" type="number" placeholder="128" />
            </Box>
          </SectionCard>

          <SectionCard title="Organization">
            <RHFTextField name="category" label="Category" placeholder="Audio" />
          </SectionCard>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="outlined" size="large" onClick={() => router.push(PATHS.admin.products)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" disabled={creating || updating}>
              {creating || updating ? "Saving…" : "Save product"}
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Box>
  );
}
