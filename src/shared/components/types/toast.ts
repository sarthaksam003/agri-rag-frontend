export type ToastType =
    | "success"
    | "error"
    | "warning"
    | "info";

export interface ToastData {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
}