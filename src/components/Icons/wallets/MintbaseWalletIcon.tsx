import { Icon, type IconProps } from '@chakra-ui/react';

export const MintbaseWalletIcon = ({ ...props }: IconProps) => {
  return (
    <Icon h="8" viewBox="0 0 300 300" w="8" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g transform="translate(110, 150)">
        <path
          d="M51.98-21.38H39.32v-48.65a21.28 21.28 0 10-8.56 17v31.65h-48.84c-11.714 0-21.21 9.496-21.21 21.21v49.1h-12.66c-11.695-.005-21.189 9.453-21.229 21.147-.04 11.695 9.39 21.217 21.084 21.293 11.694.075 21.245-9.326 21.355-21.02V57.49H1.11a21.19 21.19 0 1017-8.56h-48.84v-32.1c8.437 6.292 20.213 5.437 27.654-2.006 7.44-7.443 8.29-19.22 1.996-27.654h31.84V.03c.11 11.687 9.654 21.083 21.342 21.01C63.79 20.966 73.215 11.452 73.18-.236c-.036-11.688-9.521-21.143-21.209-21.144zm-33.87-36a12.66 12.66 0 1112.65-12.66c-.005 6.987-5.663 12.653-12.65 12.67zM30.76 70.14a12.66 12.66 0 11-25.32-.02 12.66 12.66 0 0125.32.03zm-82.71 12.62a12.66 12.66 0 1112.66-12.65c-.006 6.988-5.672 12.65-12.66 12.65zm33.87-70.31A12.66 12.66 0 11-5.42-.17c-.006 6.99-5.67 12.654-12.66 12.66zm70.06 0A12.66 12.66 0 1164.63-.21c.011 7-5.65 12.683-12.65 12.7z"
          fill="#FF2424"
          transform="scale(1.5)"
          vectorEffect="non-scaling-stroke"
        ></path>
      </g>
    </Icon>
  );
};