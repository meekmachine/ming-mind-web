import React from 'react';
import { ChakraProvider, CSSReset, ColorModeScript, extendTheme, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormPage from './FormPage';
import ResponsePage from './ResponsePage';
import customTheme from './theme'; // Import your custom Chakra UI theme

function App() {
  return (
    <ChakraProvider theme={extendTheme(customTheme, theme)}> {/* Extend the default theme with customTheme */}
      <ColorModeScript initialColorMode="dark" /> {/* Use "dark" for dark mode */}
      <CSSReset />
      <Router>
        <Routes>
          <Route path="/ming-mind-web" element={<FormPage />} />
          <Route path="/response" element={<ResponsePage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
