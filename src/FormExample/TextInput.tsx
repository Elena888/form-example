import { FormControl, FormLabel, TextField } from "@mui/material";

interface TextInputProps {
  error: boolean;
  errorMessage: string | null;
  id: string;
  type: string;
  value: string;
  label: string;
  handleChange: (value: string) => void;
  handleBlur: (value: string) => void;
}

function TextInput({
  error,
  errorMessage,
  handleChange,
  handleBlur,
  id,
  type,
  value,
  label,
}: TextInputProps) {
  return (
    <FormControl>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <TextField
        error={error}
        helperText={errorMessage}
        id={id}
        type={type}
        name={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={(e) => handleBlur(e.target.value.trim())}
        placeholder={label}
        autoComplete={id}
        required
        fullWidth
        variant="outlined"
        color={error ? "error" : "primary"}
      />
    </FormControl>
  );
}

export default TextInput;
