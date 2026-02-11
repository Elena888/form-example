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
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteFile: (file: File) => void;
  isDragging: boolean;
  files: File[];
  filesError: string | null;
}

function FilesInput({
  handleDrop,
  handleDragOver,
  handleDragLeave,
  isDragging,
  handleFileChange,
  files,
  filesError,
  handleDeleteFile,
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
    </>
  );
}

export default FilesInput;
