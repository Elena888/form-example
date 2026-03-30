import {
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from "@mui/material";
import { FileDownload, Delete } from "@mui/icons-material";

interface FilesFormProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteFile: (file: File) => void;
  isDragging: boolean;
  files: File[];
  filesError: string | null;
  acceptedFileTypes: string;
}

function FilesInput({
  isDragging,
  handleFileChange,
  files,
  filesError,
  handleDeleteFile,
  acceptedFileTypes,
}: FilesFormProps) {
  return (
    <>
      <Typography
        component="p"
        sx={{ width: "100%", fontSize: "clamp(1rem, 10vw, 1rem)" }}
      >
        Upload your files:
      </Typography>
      <Box
        className="dNd-field"
        sx={{
          backgroundColor: isDragging ? "action.hover" : "background.paper",
          borderColor: isDragging ? "primary.main" : "divider",
          color: "text.primary",
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        <Typography
          component="p"
          sx={{ width: "100%", fontSize: "clamp(1rem, 10vw, 1rem)" }}
        >
          Release to Upload or
          <Button variant="text" component="label" className="text-btn">
            Browse
            <input
              type="file"
              hidden
              multiple
              accept={acceptedFileTypes}
              onChange={handleFileChange}
            />
          </Button>
        </Typography>

        <FileDownload sx={{ fontSize: 40 }} color="primary" />
        <Typography
          component="p"
          sx={{
            width: "100%",
            fontSize: "clamp(0.5rem, 10vw, 0.8rem)",
            color: "text.secondary",
          }}
        >
          Supports: JPEG, PNG, WEBP
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
    </>
  );
}

export default FilesInput;
