import '../styles/index.css';
import { Box } from '../components/Box';
import { Pinwheel } from '../components/Pinwheel';

export default function App() {
  return (
    <Box
      bg="$core60"
      height="100vh"
      width="100vw"
      display="flex"
      placeItems="center"
      fontFamily="$body"
    >
      <Box
        bg="$core10"
        borderRadius={{ mobile: '$4x', desktop: '$5x' }}
        padding={{ mobile: '$2000 $2500', desktop: '$3000 $3500' }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap={{ mobile: '$2000', desktop: '$2500' }}
        >
          <Box
            animation={{ hover: '5s pinwheelSpin ease infinite' }}
            size={{ mobile: '60px', tablet: '75px', desktop: '200px' }}
            aria-hidden="true"
          >
            <Pinwheel label="Wayfair Pinwheel" />
          </Box>
          <Box
            as="h1"
            color="$black80"
            typeSize={{ mobile: '$1000', desktop: '$2500' }}
          >
            Vanilla Extract & Rainbow Sprinkles
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
