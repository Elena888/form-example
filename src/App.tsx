import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import FormExample from "./FormExample";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111827",
      paper: "#1f2937",
    },
    primary: {
      main: "#7dd3fc",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <FormExample />
    </ThemeProvider>
  );
}

export default App;
