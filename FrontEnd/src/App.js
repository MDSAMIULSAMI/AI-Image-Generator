import * as React from 'react';
import {
  ChakraProvider,
  extendTheme,
  Heading,
  Container,
  Input,
  Button,
  Wrap,
  Image,
  Text,
  Skeleton,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
  colors: {
    neon: {
      500: '#39FF14',
      600: '#32E214',
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: 'neon.500',
        textShadow: '0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14',
      },
    },
    Button: {
      baseStyle: {
        bg: 'neon.500',
        _hover: {
          bg: 'neon.600',
        },
        textShadow: '0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14',
      },
    },
  },
});

const App = () => {
  const [image, updateImage] = useState(null);
  const [prompt, updatePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
      updateImage(result.data.image);
    } catch (err) {
      setError('An error occurred while generating the image');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ChakraProvider theme={customTheme}>
      <Container maxW="container.md" p={4}>
        <Heading textAlign="center" mb={4}>
          🌛 Text to Image AI Generator 🌜
        </Heading>
        <Wrap justify="center" mb={4} spacing={4}>
          <Input
            value={prompt}
            onChange={(e) => updatePrompt(e.target.value)}
            width={{ base: '100%', md: '350px' }}
            placeholder="Enter your prompt here"
            bg="gray.800"
            borderColor="neon.500"
            _placeholder={{ color: 'gray.500' }}
          />
          <Button onClick={generate} colorScheme="neon">
            Create
          </Button>
        </Wrap>
        {loading && <Skeleton height="300px" />}
        {error && (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        )}
        {image && !loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Image
              src={`data:image/png;base64,${image}`}
              alt="Generated"
              maxH="500px"
              objectFit="contain"
            />
          </Box>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default App;
