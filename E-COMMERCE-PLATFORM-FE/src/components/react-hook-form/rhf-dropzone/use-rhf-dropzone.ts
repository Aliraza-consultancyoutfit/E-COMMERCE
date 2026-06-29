import { useTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { IFileUploadProps } from "./rhf-dropzone.interface";

export const useRhfDropzone = (props: IFileUploadProps) => {
  const { name, accept, maxSize, disabled } = props;

  const { setValue, getValues, watch, setError, clearErrors }: any =
    useFormContext();

  const theme = useTheme();
  const [file, setFile] = useState(getValues(name) || null);

  const onDrop = useCallback(
    (acceptedFiles: any, fileRejections: any) => {
      if (fileRejections?.length > 0) {
        const errorCode = fileRejections[0]?.errors?.[0]?.code;

        if (errorCode === "file-too-large") {
          setError(name, {
            type: "manual",
            message: `File size should be less than ${
              maxSize ? maxSize / 1024 : "the allowed"
            } KB`,
          });
        }

        return;
      }

      const selectedFile = acceptedFiles?.[0];
      if (selectedFile) {
        clearErrors(name);
        setValue(name, selectedFile);
        setFile(selectedFile);
      }
    },
    [name, setError, clearErrors, setValue, maxSize]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    disabled,
    maxSize,
    multiple: false,
    onDrop,
  });

  const handleClick = () => {
    setValue(name, null);
    setFile(null);
    clearErrors(name);
  };

  useEffect(() => {
    const currentFile = getValues(name);
    if (currentFile) {
      setFile(currentFile);
    }
  }, [getValues, name]);

  useEffect(() => {
    const subscription = watch((value: any) => {
      if (value[name] === null) {
        setFile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [watch, name]);

  return { file, getRootProps, getInputProps, handleClick, theme };
};
