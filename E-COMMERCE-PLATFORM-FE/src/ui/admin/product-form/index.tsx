"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import { PATHS } from "@/constants/routes";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/store/products/products.api";
import { getApiErrorMessage } from "@/utils/api-error";

const schema = yup.object({
  name: yup.string().trim().required("Product name is required"),
  description: yup.string().default(""),
  category: yup.string().trim().required("Category is required"),
  image: yup.string().default(""),
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
          image: product.image,
          price: product.price,
          oldPrice: product.oldPrice,
          stock: product.stock,
        }
      : undefined,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      image: "",
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
      image: values.image,
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

          <SectionCard title="Pricing & inventory">
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
              <RHFTextField name="price" label="Price ($)" type="number" placeholder="199" />
              <RHFTextField name="oldPrice" label="Compare at ($)" type="number" placeholder="249" />
              <RHFTextField name="stock" label="Stock" type="number" placeholder="128" />
            </Box>
          </SectionCard>

          <SectionCard title="Organization">
            <Stack spacing={2}>
              <RHFTextField name="category" label="Category" placeholder="Audio" />
              <RHFTextField name="image" label="Image URL" placeholder="https://… (optional)" />
            </Stack>
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
