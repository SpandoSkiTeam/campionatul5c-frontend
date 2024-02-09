import {
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  InfoOutlined,
  WarningAmberRounded,
} from '@mui/icons-material';
import { Alert, Box, Typography } from '@mui/material';
import { CustomContentProps, SnackbarContent, closeSnackbar } from 'notistack';
import { forwardRef } from 'react';

interface OqSnackProps extends CustomContentProps {
  title: string;
}

// eslint-disable-next-line react/display-name
export const BrSnack = forwardRef<HTMLDivElement, OqSnackProps>((props: OqSnackProps, ref) => {
  const { id, message, title, ...other } = props;
  const variant = other.variant === 'default' ? 'info' : other.variant;

  return (
    <SnackbarContent key={id} ref={ref} role='alert'>
      <Alert
        variant='filled'
        severity={variant}
        iconMapping={{
          success: <CheckCircleOutlineRounded />,
          info: <InfoOutlined />,
          error: <ErrorOutlineRounded />,
          warning: <WarningAmberRounded />,
        }}
        sx={{
          whiteSpace: 'pre-wrap',
          ...(message && { minHeight: '4.625rem' }),
          ...(!message && { maxHeight: 'auto' }),
          width: '25rem',
          '.MuiAlert-message': {
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          },
          '.MuiAlert-action': {
            padding: '0',
            marginRight: 0,
          },
          '.MuiAlert-icon': {
            alignItems: 'center',
          },
          padding: '0.75rem',
        }}
        slotProps={{
          closeButton: {
            sx: {
              padding: 0,
            },
          },
        }}
        onClose={() => closeSnackbar(id)}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {message && <Typography variant='body2'>{message}</Typography>}
        </Box>
      </Alert>
    </SnackbarContent>
  );
});
