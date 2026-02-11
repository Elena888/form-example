import { FormControl, FormLabel, TextField } from "@mui/material";

interface TextInputProps {
  error: boolean;
  errorMessage: string | null;
  id: string;
  type: string;
  value: string ;
  label: string;
  handleChange: (value: string) => void;
}

function TextInput({
  error,
  errorMessage,
  handleChange,
  id,
  type,
  value,
  label,
}: TextInputProps) {
  return (
    <FormControl>
      <FormLabel htmlFor="name">{label}</FormLabel>
      <TextField
        error={error}
        helperText={errorMessage}
        id={id}
        type={type}
        name={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => handleChange(e.target.value.trim())}
        placeholder="name"
        autoComplete="name"
        autoFocus
        required
        fullWidth
        variant="outlined"
        color={error ? "error" : "primary"}
      />
    </FormControl>
  );
}

export default TextInput;
