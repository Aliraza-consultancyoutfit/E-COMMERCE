import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import CustomLabel from "@/components/custom-label";
import { useRhfDropzone } from "./use-rhf-dropzone";
import { IFileUploadProps } from "./rhf-dropzone.interface";
import { AttachedFileIcon } from "@/assets/icons/common";
import { PALETTE_MODE } from "@/constants/strings";
import { useFormContext, useController } from "react-hook-form";

export default function RHFDropzonePreview(props: IFileUploadProps) {
  const {
    name,
    required,
    fileName = "",
    fileType = "",
    dragMessage = "screenshot if have any",
    ...other
  } = props;

  const { control, formState } = useFormContext();
  const { field } = useController({ name, control });

  const { file, getRootProps, getInputProps, handleClick } = useRhfDropzone({
    ...props,
    field,
  });

  const theme = useTheme();
  const error = formState?.errors?.[name];

  return (
    <>
      {other?.label && <CustomLabel label={other?.label} required={required} />}

      <Box
        {...getRootProps({ onClick: handleClick })}
        sx={{
          border: "1px dashed",
          borderColor: error
            ? theme.palette.error.main
            : theme.palette.mode === PALETTE_MODE.LIGHT
            ? theme.palette.grey[700]
            : theme.palette.darkShades[700],
          borderRadius: 4,
          padding: 2.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 150,
          cursor: "pointer",
          backgroundColor:
            theme.palette.mode === PALETTE_MODE.LIGHT
              ? theme.palette.grey[900]
              : theme.palette.darkShades[800],
        }}
      >
        <input {...getInputProps()} />
        {file ? (
          <Image
            src={file?.preview || URL.createObjectURL(file)}
            alt={name}
            width={100}
            height={100}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
            }}
          >
            <Box
              sx={{
                backgroundImage:
                  theme.palette.mode === PALETTE_MODE.LIGHT
                    ? theme.palette.gradients.b
                    : theme.palette.gradients.p,
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 1,
              }}
            >
              <AttachedFileIcon />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight="bold" color="grey.100">
                {fileName}
              </Typography>
              <Typography variant="body2" color="grey.100">
                Drag or{" "}
                <Typography
                  component="span"
                  fontSize={12}
                  color={theme.palette.primary.main}
                >
                  Upload{" "}
                </Typography>
                {dragMessage}
              </Typography>
              <Typography component="span" fontSize={12} color="grey.100">
                {fileType}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {error && (
        <Typography
          variant={"body2"}
          component={"span"}
          color={"tertiary.main"}
          sx={{ ml: 1.5 }}
        >
          {error?.message as string}
        </Typography>
      )}
    </>
  );
}