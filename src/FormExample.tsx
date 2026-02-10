import { useState } from "react";
import {
  Button,
  Container,
  Box,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from "@mui/material";
import { FileDownload, Delete } from "@mui/icons-material";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function FormExample() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || nameError) {
      return;
    }

    console.log({
      name,
      email,
      files,
    });
  };

  const validateInputs = () => {
    let isValid = true;

    if (!name || name.length < 2) {
      setNameError(true);
      setNameErrorMessage("Please enter a valid name.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
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
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <TextField
            error={nameError}
            helperText={nameErrorMessage}
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => setName(e.target.value.trim())}
            placeholder="name"
            autoComplete="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={nameError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => setEmail(e.target.value.trim())}
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>

        <Typography
          component="p"
          sx={{ width: "100%", fontSize: "clamp(1rem, 10vw, 1rem)" }}
        >
          Upload your files:
        </Typography>

        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="dNd-field"
          sx={{
            backgroundColor: isDragging ? "#f3f9ff" : "#fff",
          }}
        >
          <Typography
            component="p"
            sx={{ width: "100%", fontSize: "clamp(1rem, 10vw, 1rem)" }}
          >
            Release to Upload or
            <Button variant="text" component="label" className="text-btn">
              Browse
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
          </Typography>

          <FileDownload sx={{ fontSize: 40 }} color="primary" />
          <Typography
            component="p"
            sx={{
              width: "100%",
              fontSize: "clamp(0.5rem, 10vw, 0.8rem)",
              color: "#a7a7a7",
            }}
          >
            Supports: JPEG, JPG, PNG
          </Typography>
          {files && files.length > 0 && (
            <List>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteFile(file)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        {filesError && <Alert severity="error">{filesError}</Alert>}
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
