import AboutUsBanner from "@/components/AboutUs/AboutUsBanner";
import AboutUsIntro from "@/components/AboutUs/AboutUsIntro";
import Commited from "@/components/AboutUs/Commited";
import Mission from "@/components/AboutUs/Mission";
import MyService from "@/components/AboutUs/MyService";
import WhyChooseUs from "@/components/AboutUs/WhyChooseUs";
import Container from "@/components/Container";

const AboutPage = () => {
  return (
    <Container className="max-w-6xl lg:px-8 py-12">
      <AboutUsBanner />
      <AboutUsIntro />
      <Mission />
      <MyService />
      <WhyChooseUs />
      <Commited />
    </Container>
  );
};

export default AboutPage;
