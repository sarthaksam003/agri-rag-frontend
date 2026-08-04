import { primitive } from "./primitives";

export const semantic = {
  background: {
    app: primitive.neutral[50],
    surface: "#FFFFFF",
  },

  text: {
    primary: primitive.neutral[900],
    secondary: primitive.neutral[600],
  },

  border: {
    default: primitive.neutral[200],
  },

  brand: {
    primary: primitive.emerald[600],
  },

  status: {
    success: primitive.emerald[500],
    error: primitive.red[500],
    warning: primitive.amber[500],
    info: primitive.blue[500],
  },
};