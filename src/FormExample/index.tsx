import { useState } from "react";
import { Button, Container, Box, Typography } from "@mui/material";

import FilesInput from "./FilesInput";
import TextInput from "./TextInput";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function FormExample() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [nameErrorMessage, setNameErrorMessage] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");

  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameErrorMessage.length > 0 || emailErrorMessage.length > 0) {
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
  };

  const validateInputs = () => {
    let isValid = true;

    if (!name || name.length < 2) {
      setNameErrorMessage("Please enter a valid name.");
      isValid = false;
    } else {
      setNameErrorMessage("");
    }

    if (/\d/.test(name)) {
      setNameErrorMessage("Please enter a valid name without numbers");
      isValid = false;
    } else {
      setNameErrorMessage("");
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailErrorMessage("");
    }

    return isValid;
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
    validateAndAddFiles(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
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
    <Container maxWidth="sm">
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
          handleChange={setName}
          id="name"
          type="text"
          value={name}
          label="Name"
        />

        <TextInput
          error={emailErrorMessage.length > 0}
          errorMessage={emailErrorMessage}
          handleChange={setEmail}
          id="email"
          type="email"
          value={email}
          label="Email"
        />

        <FilesInput
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          isDragging={isDragging}
          handleFileChange={handleFileChange}
          files={files}
          filesError={filesError}
          handleDeleteFile={handleDeleteFile}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
          sx={{ mx: 0, my: 3, p: 2, fontSize: "clamp(1rem, 10vw, 1rem)" }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default FormExample;
