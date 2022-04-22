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
      padding="$3500"
    >
      <Box
        bg="core10"
        borderRadius={{ mobile: '$4x', desktop: '$5x' }}
        padding={{ mobile: '$2500', desktop: '$3000' }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap={{ mobile: '$2000', desktop: '$2500' }}
        >
          <Box
            animation="1.2s pinwheelSpin ease-in-out infinite"
            size={{ mobile: '60px', tablet: '75px', desktop: '100px' }}
            aria-hidden="true"
          >
            <Pinwheel label="Wayfair Pinwheel" />
          </Box>
          <Box
            as="h1"
            fontFamily="$body"
            color="$black80"
            typeSize={{ mobile: '$1000', desktop: '$1000' }}
          >
            Vanilla Extract & Rainbow Sprinkles
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
