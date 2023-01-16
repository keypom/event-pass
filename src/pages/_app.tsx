import { ChakraProvider } from '@chakra-ui/react';

import { CoreLayout } from '@/common/components/CoreLayout';
import { PageHead } from '@/common/components/PageHead';
import { theme, archia, inter } from '@/common/theme';
import { AuthWalletContextProvider } from '@/common/contexts/AuthWalletContext';

import '@near-wallet-selector/modal-ui/styles.css';

export const App = ({ Component, pageProps }) => {
  const Layout = Component.layout ? Component.layout : CoreLayout;
  return (
    <>
      <style global jsx>{`
        :root {
          --archia-font: ${archia.style.fontFamily};
          --inter-font: ${inter.style.fontFamily};
        }
      `}</style>
      <AuthWalletContextProvider>
        <ChakraProvider theme={theme}>
          {/* <div className={inter.className}> */}
          <PageHead />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {/* </div> */}
        </ChakraProvider>
      </AuthWalletContextProvider>
    </>
  );
};

export default App;
