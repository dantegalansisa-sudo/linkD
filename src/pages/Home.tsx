import Hero from '../components/sections/Hero';
import TrustBand from '../components/sections/TrustBand';
import News from '../components/sections/News';
import EcosystemSolutions from '../components/sections/EcosystemSolutions';
import Products from '../components/sections/Products';
import Industries from '../components/sections/Industries';
import Results from '../components/sections/Results';
import Resources from '../components/sections/Resources';
import CTASection from '../components/sections/CTASection';
import Band from '../components/sections/Band';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBand />
      <News />
      <EcosystemSolutions />
      <Products />
      <Industries />
      <Results />
      <Resources />
      <CTASection />
      {/* Pendientes del brief: el texto del ticker (12) y el footer nuevo (13) */}
      <Band />
    </main>
  );
}
