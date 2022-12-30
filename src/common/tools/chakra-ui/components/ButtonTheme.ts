import { defineStyleConfig } from '@chakra-ui/react';

export const ButtonTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: 'xl',
    fontWeight: 'medium',
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      py: '3',
      px: '4',
    },
    md: {
      fontSize: 'md',
      py: '4',
      px: '6',
    },
  },
  variants: {
    primary: {
      border: '2px solid transparent',
      color: 'white',
      bgColor: 'gray.800',
      _hover: {
        bgColor: 'gray.900',
      },
      _focus: {
        bgColor: 'gray.900',
        border: '2px solid',
        borderColor: 'blue.400',
      },
      _disabled: {
        _hover: {
          bg: 'gray.900 !important',
        },
      },
    },
    secondary: {
      border: '2px solid',
      borderColor: 'gray.200',
      color: 'gray.800',
      bgColor: 'white',
      _hover: {
        bgColor: 'gray.200',
      },
      _focus: {
        bgColor: 'gray.200',
        border: '2px solid',
        borderColor: 'blue.400',
      },
    },
    icon: {
      border: '2px solid',
      borderColor: 'gray.200',
      color: 'gray.800',
      bgColor: 'white',
      borderRadius: '100%',
      px: '8px',
      _hover: {
        bgColor: 'gray.200',
      },
      _focus: {
        bgColor: 'gray.200',
        border: '2px solid',
        borderColor: 'blue.400',
      },
    },
    pill: {
      borderRadius: '52px',
      bg: 'border.box',
      border: '1px solid transparent',
    },
  },
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
});
