import { SnackbarProvider as NotiSnackbarProvider } from 'notistack';
import { BrSnack } from './BrSnack';

declare module 'notistack' {
  interface VariantOverrides {
    success: {
      title: string;
    };
    warning: {
      title: string;
    };
    error: {
      title: string;
    };
    info: {
      title: string;
    };
  }
}

export const SnackbarProvider = () => {
  return (
    <NotiSnackbarProvider
      hideIconVariant
      classes={{ containerRoot: 'oq-snakbar-container' }}
      disableWindowBlurListener
      style={{ justifyContent: 'end' }}
      Components={{ success: BrSnack, info: BrSnack, warning: BrSnack, error: BrSnack }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    />
  );
};
