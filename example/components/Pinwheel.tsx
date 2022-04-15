import { Box, BoxProps } from './Box';

export const Pinwheel = ({
  label,
  ...props
}: { label: string } & BoxProps<'svg'>) => (
  <Box
    is="svg"
    focusable="false"
    viewBox="0 0 28 28"
    verticalAlign="middle"
    display="inline-block"
    {...props}
  >
    <title>{label}</title>
    <path d="M14 4.92L23.08 14 14 23.08 4.92 14z" fill="#752a7d"></path>
    <path d="M2.27 2.27L9.08 0 14 4.92 4.92 14 0 9.08z" fill="#c6d637"></path>
    <path
      d="M25.73 2.27L28 9.08 23.08 14 14 4.92 18.92 0z"
      fill="#88cc79"
    ></path>
    <path
      d="M25.73 25.73L18.92 28 14 23.08 23.08 14 28 18.92z"
      fill="#d47eed"
    ></path>
    <path
      d="M2.27 25.73L0 18.92 4.92 14 14 23.08 9.08 28z"
      fill="#f7cf1f"
    ></path>
  </Box>
);
