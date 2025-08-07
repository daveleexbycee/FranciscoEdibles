import Hero from '@/components/landing/hero';
import FeaturedMenu from '@/components/landing/featured-menu';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedMenu />
      <Script type='text/javascript' src='//pl27370345.profitableratecpm.com/a9/90/fc/a990fcf2a106aa98c0fdb25760e4dae5.js' />
    </>
  );
}
