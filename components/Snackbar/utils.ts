import { enqueueSnackbar } from 'notistack';

export const enqueueInfoSnackbar = (title: string, message = '') => {
  enqueueSnackbar(message, { variant: 'info', title: title });
};

export const enqueueSuccessSnackbar = (title: string, message = '') => {
  enqueueSnackbar(message, { variant: 'success', title: title });
};

export const enqueueWarningSnackbar = (title: string, message = '') => {
  enqueueSnackbar(message, { variant: 'warning', title: title });
};

export const enqueueErrorSnackbar = (title: string, message = '') => {
  enqueueSnackbar(message, { variant: 'error', title: title });
};
