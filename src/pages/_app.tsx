import '../styles/global.css';

import { ReactLenis } from 'lenis/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { ToastProvider } from '../components/ui/toast/ToastContext';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthFlowProvider } from '../contexts/AuthFlowContext';
import type { AppPropsWithLayout } from '../types/next';

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleStart = () => setTransitioning(true);
    const handleComplete = () => {
      setTransitioning(false);
      if (wrapperRef.current) {
        wrapperRef.current.classList.remove('page-transition-enter');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        wrapperRef.current.offsetHeight;
        wrapperRef.current.classList.add('page-transition-enter');
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      <AuthFlowProvider>
        <ToastProvider>
          <ReactLenis
            root
            options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
          >
            <div
              ref={wrapperRef}
              className={`page-transition-enter transition-opacity duration-200 ${
                transitioning ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {getLayout(<Component {...pageProps} />)}
            </div>
          </ReactLenis>
        </ToastProvider>
      </AuthFlowProvider>
    </AuthProvider>
  );
};

export default MyApp;
