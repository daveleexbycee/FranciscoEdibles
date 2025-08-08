import Hero from '@/components/landing/hero';
import FeaturedMenu from '@/components/landing/featured-menu';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedMenu />
       <Script id="adsterra-config-home" strategy="lazyOnload">
        {`
          atOptions = {
            'key' : '3896d1f899c8b3a6de8dd59794ad2a90',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `}
      </Script>
      <Script
        id="adsterra-script-home"
        strategy="lazyOnload"
        src="//www.highperformanceformat.com/3896d1f899c8b3a6de8dd59794ad2a90/invoke.js"
      />
    </>
  );
}
