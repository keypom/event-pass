import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

import { baseStyle } from './baseStyle';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

type defaultProps = ReturnType<typeof defineMultiStyleConfig>['defaultProps'];

const modalDefaultProps = {
  isCentered: true,
} as defaultProps; // type casting is necessary because defaultProps is not accepting ModalProps

export const ModalTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: modalDefaultProps,
});
