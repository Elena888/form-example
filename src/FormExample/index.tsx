import { useRef, useState } from "react";
import { Button, Container, Box, Typography } from "@mui/material";

import FilesInput from "./FilesInput";
import TextInput from "./TextInput";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_FILE_TYPES = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

function FormExample() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
  });

  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateInputs();

    if (!isValid) {
      return;
    }

    console.log("Data", {
      name,
      email,
      files,
    });

    setEmail("");
    setName("");
    setFiles([]);
    setNameErrorMessage("");
    setEmailErrorMessage("");
    setTouched({
      name: false,
      email: false,
    });
  };

  const validateName = (value: string) => {
    if (!value || value.length < 2) {
      return "Please enter a valid name.";
    }

    if (/\d/.test(value)) {
      return "Please enter a valid name without numbers";
    }

    return "";
  };

  const validateEmail = (value: string) => {
    if (!value || !/\S+@\S+\.\S+/.test(value)) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const validateInputs = () => {
    const nextNameError = validateName(name);
    const nextEmailError = validateEmail(email);

    setNameErrorMessage(nextNameError);
    setEmailErrorMessage(nextEmailError);
    setTouched({
      name: true,
      email: true,
    });

    return !nextNameError && !nextEmailError;
  };

  const handleNameChange = (value: string) => {
    setName(value);

    if (touched.name) {
      setNameErrorMessage(validateName(value));
    }
  };

  const handleNameBlur = (value: string) => {
    setTouched((prev) => ({ ...prev, name: true }));
    setName(value);
    setNameErrorMessage(validateName(value));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (touched.email) {
      setEmailErrorMessage(validateEmail(value));
    }
  };

  const handleEmailBlur = (value: string) => {
    setTouched((prev) => ({ ...prev, email: true }));
    setEmail(value);
    setEmailErrorMessage(validateEmail(value));
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    const errors: string[] = [];

    const validFiles = newFiles.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: unsupported file type`);
        return false;
      }

      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: file too large`);
        return false;
      }

      if (files.find((f) => f.name === file.name && f.size === file.size)) {
        errors.push(`${file.name}: duplicate file`);
        return false;
      }
      setFilesError("");
      return true;
    });

    if (errors.length) {
      setFilesError(errors.join(", "));
    }
    setIsDragging(false);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    validateAndAddFiles(Array.from(event.dataTransfer.files));
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    validateAndAddFiles(Array.from(event.target.files));
  };

  const handleDeleteFile = (item: File) => {
    const filesList = files.filter((file) => file.name !== item.name);
    setFiles(filesList);
    setFilesError("");
  };

  return (
    <Box
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        minHeight: "100vh",
        position: "relative",
        py: 4,
      }}
    >
      {isDragging && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            border: "3px dashed",
            borderColor: "primary.main",
            backgroundColor: "rgba(125, 211, 252, 0.12)",
            pointerEvents: "none",
          }}
        />
      )}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            px: 0,
            py: 5,
          }}
        >
          Form Example
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <TextInput
            error={nameErrorMessage.length > 0}
            errorMessage={nameErrorMessage}
            handleChange={handleNameChange}
            handleBlur={handleNameBlur}
            id="name"
            type="text"
            value={name}
            label="Name"
          />

          <TextInput
            error={emailErrorMessage.length > 0}
            errorMessage={emailErrorMessage}
            handleChange={handleEmailChange}
            handleBlur={handleEmailBlur}
            id="email"
            type="email"
            value={email}
            label="Email"
          />

          <FilesInput
            isDragging={isDragging}
            handleFileChange={handleFileChange}
            files={files}
            filesError={filesError}
            handleDeleteFile={handleDeleteFile}
            acceptedFileTypes={ACCEPTED_FILE_TYPES}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mx: 0, my: 3, p: 2, fontSize: "clamp(1rem, 10vw, 1rem)" }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default FormExample;
